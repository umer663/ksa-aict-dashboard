import { useEffect, useState } from 'react';
import { Container, Paper, Typography, Grid, TextField, Button, Chip, Box, IconButton, Divider, Stack, Alert, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useForm, Controller, useFieldArray, useController } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { HumanBodyRecord } from '../../models/types';
import { createHumanBodyRecord, fetchHumanBodyRecords, deleteHumanBodyRecord, updateHumanBodyRecord } from '../../services/humanBodyService';

const pageVariants = {
  initial: {
    opacity: 0,
    x: -20,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
    },
  },
  exit: {
    opacity: 0,
    x: 20,
  },
};

const schema = yup.object({
  name: yup.string().required('Name is required'),
  system: yup.string().required('System is required'),
  description: yup.string().required('Description is required'),
  symptoms: yup.array(yup.string().trim().min(1)).min(1, 'At least one symptom').required(),
  medicine: yup
    .array(
      yup.object({
        options: yup.array(yup.string().trim().min(1)).min(1, 'At least one option').required('Options are required'),
        note: yup.string().required('Note is required'),
      })
    )
    .min(1, 'At least one medicine entry')
    .required(),
});

type FormValues = yup.InferType<typeof schema>;

const defaultValues: FormValues = {
  name: '',
  system: '',
  description: '',
  symptoms: [],
  medicine: [
    { options: [], note: '' },
  ],
};

const HumanBody = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [records, setRecords] = useState<HumanBodyRecord[]>([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selected, setSelected] = useState<HumanBodyRecord | null>(null);
  const [search, setSearch] = useState('');

  const { control, handleSubmit, reset, watch, setValue } = useForm<FormValues>({
    defaultValues,
    resolver: yupResolver(schema),
    mode: 'onBlur',
  });

  const { fields: medicineFields, append: appendMedicine, remove: removeMedicine } = useFieldArray({
    control,
    name: 'medicine',
  });

  // For adding symptoms as chips
  const symptoms = (watch('symptoms') ?? []) as string[];
  const [symptomInput, setSymptomInput] = useState('');

  const addSymptom = () => {
    const value = symptomInput.trim();
    if (!value) return;
    if (!symptoms.includes(value)) {
      setValue('symptoms', [...symptoms, value]);
    }
    setSymptomInput('');
  };

  const removeSymptom = (symptom: string) => {
    setValue('symptoms', symptoms.filter(s => s !== symptom));
  };

  const loadRecords = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchHumanBodyRecords();
      setRecords(data);
    } catch (e) {
      setError('Failed to load records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const payload: Omit<HumanBodyRecord, 'id'> = {
        name: values.name,
        system: values.system,
        description: values.description,
        symptoms: (values.symptoms || []).filter((s): s is string => typeof s === 'string' && s.trim().length > 0),
        medicine: (values.medicine || []).map((m) => ({
          note: m.note,
          options: (m.options || []).filter((o): o is string => typeof o === 'string' && o.trim().length > 0),
        })),
      };
      if (editingId) {
        await updateHumanBodyRecord(editingId, payload);
        setSuccess('Record updated successfully');
      } else {
        await createHumanBodyRecord(payload);
        setSuccess('Record added successfully');
      }
      reset(defaultValues);
      setEditingId(null);
      setOpen(false);
      await loadRecords();
    } catch (e) {
      setError(editingId ? 'Failed to update record' : 'Failed to add record');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!id) return;
    setError(null);
    try {
      await deleteHumanBodyRecord(id);
      await loadRecords();
    } catch (e) {
      setError('Failed to delete record');
    }
  };

  const openCreateDialog = () => {
    reset(defaultValues);
    setEditingId(null);
    setOpen(true);
  };

  const openEditDialog = (rec: HumanBodyRecord) => {
    reset({
      name: rec.name || '',
      system: rec.system || '',
      description: rec.description || '',
      symptoms: Array.isArray(rec.symptoms) ? rec.symptoms : [],
      medicine: Array.isArray(rec.medicine) ? rec.medicine.map(m => ({ note: m.note || '', options: Array.isArray(m.options) ? m.options : [] })) : [],
    });
    setEditingId(rec.id || null);
    setOpen(true);
  };

  const openDetail = (rec: HumanBodyRecord) => {
    setSelected(rec);
  };

  const filtered = records.filter((rec) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    const inName = (rec.name || '').toLowerCase().includes(q);
    const inSystem = (rec.system || '').toLowerCase().includes(q);
    const inSymptoms = (Array.isArray(rec.symptoms) ? rec.symptoms : []).some(s => (s || '').toLowerCase().includes(q));
    const inMedicineNotes = (Array.isArray(rec.medicine) ? rec.medicine : []).some(m => (m.note || '').toLowerCase().includes(q));
    const inMedicineOptions = (Array.isArray(rec.medicine) ? rec.medicine : []).some(m => (Array.isArray(m.options) ? m.options : []).some(opt => (opt || '').toLowerCase().includes(q)));
    return inName || inSystem || inSymptoms || inMedicineNotes || inMedicineOptions;
  });

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 } }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                <Typography variant="h5">Human Body Records</Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <TextField
                    placeholder="Search by name, system, symptom, medicine"
                    size="small"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <Button variant="contained" startIcon={<Add />} onClick={openCreateDialog}>
                    Add Human Body Record
                  </Button>
                  {loading && <CircularProgress size={22} />}
                </Stack>
              </Stack>
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>{success}</Alert>}
              <Divider sx={{ mb: 2 }} />
              {filtered.length === 0 ? (
                <Typography variant="body2" color="text.secondary">No records found.</Typography>
              ) : (
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>System</TableCell>
                        <TableCell sx={{ fontWeight: 600, width: 220, maxWidth: 220, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Symptoms</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Medicine</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filtered.map((rec) => (
                        <TableRow key={rec.id} hover onClick={() => openDetail(rec)} sx={{ cursor: 'pointer' }}>
                          <TableCell>{rec.name}</TableCell>
                          <TableCell>{rec.system}</TableCell>
                          <TableCell sx={{ width: 220, maxWidth: 220 }}>
                            {(Array.isArray(rec.symptoms) ? rec.symptoms : []).slice(0, 4).map((s) => (
                              <Chip key={s} label={s} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                            ))}
                            {Array.isArray(rec.symptoms) && rec.symptoms.length > 4 && (
                              <Chip label={`+${rec.symptoms.length - 4}`} size="small" />
                            )}
                          </TableCell>
                          <TableCell>
                            {(Array.isArray(rec.medicine) ? rec.medicine : []).slice(0, 2).map((m, idx) => (
                              <Box key={idx} sx={{ mb: 0.5 }}>
                                <Typography variant="caption" color="text.secondary">{m.note}</Typography>
                                <Box>
                                  {(Array.isArray(m.options) ? m.options : []).slice(0, 3).map((opt) => (
                                    <Chip key={opt} label={opt} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                                  ))}
                                  {Array.isArray(m.options) && m.options.length > 3 && (
                                    <Chip label={`+${m.options.length - 3}`} size="small" />
                                  )}
                                </Box>
                              </Box>
                            ))}
                            {Array.isArray(rec.medicine) && rec.medicine.length > 2 && (
                              <Chip label={`+${rec.medicine.length - 2}`} size="small" />
                            )}
                          </TableCell>
                          <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                            <IconButton aria-label="edit" onClick={() => openEditDialog(rec)} sx={{ mr: 1 }}>
                              <Edit />
                            </IconButton>
                            <IconButton aria-label="delete" color="error" disabled={!rec.id} onClick={() => { if (rec.id) handleDelete(rec.id); }}>
                              <Delete />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          </Grid>
        </Grid>

        <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
          <DialogTitle>{editingId ? 'Edit Human Body Record' : 'Add Human Body Record'}</DialogTitle>
          <DialogContent dividers>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <Stack spacing={2} sx={{ mt: 1 }}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField {...field} label="Name" fullWidth error={!!fieldState.error} helperText={fieldState.error?.message} />
                  )}
                />
                <Controller
                  name="system"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField {...field} label="System" fullWidth error={!!fieldState.error} helperText={fieldState.error?.message} />
                  )}
                />
                <Controller
                  name="description"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField {...field} label="Description" fullWidth multiline minRows={3} error={!!fieldState.error} helperText={fieldState.error?.message} />
                  )}
                />

                <Box>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>Symptoms</Typography>
                  <Stack direction="row" spacing={1}>
                    <TextField
                      value={symptomInput}
                      onChange={(e) => setSymptomInput(e.target.value)}
                      label="Add symptom"
                      fullWidth
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addSymptom();
                        }
                      }}
                    />
                    <Button variant="contained" onClick={addSymptom} startIcon={<Add />}>Add</Button>
                  </Stack>
                  <Box sx={{ mt: 1 }}>
                    {symptoms.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">No symptoms added</Typography>
                    ) : (
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        {symptoms.map((s) => (
                          <Chip key={s} label={s} onDelete={() => removeSymptom(s as string)} sx={{ mb: 1 }} />
                        ))}
                      </Stack>
                    )}
                  </Box>
                </Box>

                <Divider />

                <Box>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="subtitle1">Medicine</Typography>
                    <Button variant="outlined" size="small" onClick={() => appendMedicine({ options: [], note: '' })} startIcon={<Add />}>Add Entry</Button>
                  </Stack>
                  <Stack spacing={2}>
                    {medicineFields.map((field, index) => (
                      <Paper key={field.id} variant="outlined" sx={{ p: 2 }}>
                        <Stack spacing={1}>
                          <Controller
                            name={`medicine.${index}.note` as const}
                            control={control}
                            render={({ field, fieldState }) => (
                              <TextField {...field} label="Note" fullWidth error={!!fieldState.error} helperText={fieldState.error?.message} />
                            )}
                          />
                          <OptionsEditor
                            control={control}
                            name={`medicine.${index}.options`}
                            label="Options"
                          />
                          <Box textAlign="right">
                            <Button color="error" variant="text" startIcon={<Delete />} onClick={() => removeMedicine(index)}>
                              Remove
                            </Button>
                          </Box>
                        </Stack>
                      </Paper>
                    ))}
                  </Stack>
                </Box>
              </Stack>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} disabled={submitting}>Cancel</Button>
            <Button onClick={handleSubmit(onSubmit)} variant="contained" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save'}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={!!selected} onClose={() => setSelected(null)} fullWidth maxWidth="sm">
          <DialogTitle>Record Details</DialogTitle>
          <DialogContent dividers>
            {selected && (
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Name</Typography>
                  <Typography variant="body1">{selected.name}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">System</Typography>
                  <Typography variant="body1">{selected.system}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                  <Typography variant="body1">{selected.description}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Symptoms</Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {(Array.isArray(selected.symptoms) ? selected.symptoms : []).map((s) => (
                      <Chip key={s} label={s} size="small" />
                    ))}
                  </Stack>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Medicine</Typography>
                  <Stack spacing={1}>
                    {(Array.isArray(selected.medicine) ? selected.medicine : []).map((m, idx) => (
                      <Paper key={idx} variant="outlined" sx={{ p: 1.5 }}>
                        <Typography variant="caption" color="text.secondary">{m.note}</Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 0.5 }}>
                          {(Array.isArray(m.options) ? m.options : []).map((opt) => (
                            <Chip key={opt} label={opt} size="small" />
                          ))}
                        </Stack>
                      </Paper>
                    ))}
                  </Stack>
                </Box>
              </Stack>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelected(null)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </motion.div>
  );
};

function OptionsEditor({ control, name, label }: { control: any; name: `medicine.${number}.options`; label: string }) {
  const { field } = useController({ control, name });
  const [input, setInput] = useState('');

  const addOption = () => {
    const value = input.trim();
    if (!value) return;
    if (!field.value.includes(value)) {
      field.onChange([...field.value, value]);
    }
    setInput('');
  };
  const removeOption = (opt: string) => {
    field.onChange(field.value.filter((o: string) => o !== opt));
  };

  return (
    <Box>
      <Stack direction="row" spacing={1}>
        <TextField
          value={input}
          onChange={(e) => setInput(e.target.value)}
          label={`Add ${label.toLowerCase().slice(0, -1)}`}
          fullWidth
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addOption();
            }
          }}
        />
        <Button variant="outlined" onClick={addOption} startIcon={<Add />}>Add</Button>
      </Stack>
      <Box sx={{ mt: 1 }}>
        {field.value?.length ? (
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {field.value.map((opt: string) => (
              <Chip key={opt} label={opt} onDelete={() => removeOption(opt)} sx={{ mb: 1 }} />
            ))}
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary">No {label.toLowerCase()} added</Typography>
        )}
      </Box>
    </Box>
  );
}

export default HumanBody; 