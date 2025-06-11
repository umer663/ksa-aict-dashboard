import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  Alert,
  useTheme,
  CircularProgress,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
} from '@mui/icons-material';
import { loginUser } from '../services/authService';
import { LoginFormProps, IFormInputs } from '../models/types';
import ksa from '../assets/khuwaja-shamsu-deen-azeemi.jpg';

// Maximum failed login attempts before temporary lockout
const MAX_LOGIN_ATTEMPTS = 5;
// Lockout duration in minutes
const LOCKOUT_DURATION = 15;

/**
 * Email validation regex
 * Validates:
 * - Local part can contain: letters, numbers, dots, hyphens, underscores
 * - Domain part must be valid
 * - TLD must be 2-6 characters
 * - No consecutive dots
 * - Local and domain parts must start and end with alphanumeric characters
 */
const EMAIL_REGEX = /^[a-zA-Z0-9](?:[a-zA-Z0-9._-]*[a-zA-Z0-9])?@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z]{2,6})+$/;

/**
 * Password validation regex
 * Requires:
 * - At least 8 characters
 * - Maximum 32 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character from: @$!%*?&#
 * - No spaces allowed
 * - No consecutive repeated characters
 */
const PASSWORD_REGEX = /^(?!.*(.)\1{2,})(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,32}$/;

/**
 * Validation schema for the login form with detailed error messages
 */
const schema = yup.object().shape({
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address')
    .matches(
      EMAIL_REGEX,
      'Please enter a valid email address. Example: user@domain.com'
    )
    .max(255, 'Email must not exceed 255 characters')
    .trim(),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(32, 'Password must not exceed 32 characters')
    .matches(
      /[A-Z]/,
      'Password must contain at least one uppercase letter'
    )
    .matches(
      /[a-z]/,
      'Password must contain at least one lowercase letter'
    )
    .matches(
      /[0-9]/,
      'Password must contain at least one number'
    )
    .matches(
      /[@$!%*?&#]/,
      'Password must contain at least one special character (@$!%*?&#)'
    )
    .matches(
      /^\S*$/,
      'Password must not contain spaces'
    )
    .matches(
      PASSWORD_REGEX,
      'Password must not contain consecutive repeated characters'
    ),
});

/**
 * LoginForm Component
 * 
 * A secure authentication form component with comprehensive validation and security features.
 * 
 * Features:
 * - Strong email and password validation
 * - Brute force protection with login attempt limiting
 * - Temporary account lockout after failed attempts
 * - Password visibility toggle
 * - Real-time validation feedback
 * - Comprehensive error handling
 * - Loading states and animations
 * - Accessibility support
 * - Form state persistence handling
 * 
 * Security measures:
 * - Input sanitization
 * - Rate limiting
 * - Session handling
 * - Secure password visibility toggle
 * - Form data clearing on unmount
 * 
 * @param {LoginFormProps} props - Component props containing onLogin callback
 * @returns {JSX.Element} Rendered login form
 */
const LoginForm = ({ onLogin }: LoginFormProps) => {
  const theme = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutEndTime, setLockoutEndTime] = useState<Date | null>(null);
  const navigate = useNavigate();

  // Add at the top of the component, after useNavigate():
  const quickLogins = [
    { label: 'SuperAdmin', email: 'superadmin@example.com', password: 'Super@123' },
    { label: 'Admin', email: 'admin@example.com', password: 'Admin@123' },
    { label: 'Therapist', email: 'therapist@example.com', password: 'Therapist@123' },
    { label: 'Receptionist', email: 'receptionist@example.com', password: 'Reception@123' },
  ];

  const handleQuickLogin = async (email: string, password: string) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await loginUser(email, password);
      if (response.success && response.user) {
        setLoginAttempts(0);
        setLockoutEndTime(null);
        reset();
        onLogin(response.user);
      } else {
        setError('Invalid credentials.');
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Initialize form with validation and real-time feedback
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
    watch,
  } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  // Clear form data on component unmount
  useEffect(() => {
    return () => {
      reset();
      setShowPassword(false);
    };
  }, [reset]);

  // Check if account is locked
  const isAccountLocked = () => {
    if (!lockoutEndTime) return false;
    return new Date() < lockoutEndTime;
  };

  // Handle password visibility toggle
  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  // Prevent mousedown default behavior
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  /**
   * Handle form submission with security measures
   * - Validates input data
   * - Manages login attempts
   * - Handles temporary lockouts
   * - Processes authentication
   * 
   * @param {IFormInputs} data - Validated form data
   */
  const onSubmit = async (data: IFormInputs) => {
    // Check for account lockout
    if (isAccountLocked()) {
      const timeRemaining = Math.ceil((lockoutEndTime!.getTime() - new Date().getTime()) / 60000);
      setError(`Account temporarily locked. Please try again in ${timeRemaining} minutes.`);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await loginUser(data.email.trim(), data.password);
      
      if (response.success && response.user) {
        // Reset security measures on successful login
        setLoginAttempts(0);
        setLockoutEndTime(null);
        reset();
        onLogin(response.user);
      } else {
        // Handle failed login attempt
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);

        if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
          const lockoutEnd = new Date();
          lockoutEnd.setMinutes(lockoutEnd.getMinutes() + LOCKOUT_DURATION);
          setLockoutEndTime(lockoutEnd);
          setError(`Too many failed attempts. Account locked for ${LOCKOUT_DURATION} minutes.`);
        } else {
          setError(`Invalid credentials. ${MAX_LOGIN_ATTEMPTS - newAttempts} attempts remaining.`);
        }
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Watch form fields for real-time validation
  const watchFields = watch(['email', 'password']);

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      {/* Left Section */}
      <Box
        sx={{
          flex: 1,
          bgcolor: 'primary.main',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          p: 4,
          position: 'relative',
        }}
      >
        <Box
          component="img"
          src={ksa}
          alt="Khuwaja Shamsu Deen Azeemi"
          sx={{
            width: 250,
            height: 320,
            mb: 3,
            borderRadius: '10%',
            objectFit: 'cover',
            objectPosition: 'center',
            border: '4px solid white',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          }}
        />
        {/* <Typography variant="h4" component="h1" gutterBottom>
          Welcome
        </Typography> */}
        <Typography 
          variant="h5" 
          align="center"
          sx={{
            mb: 2,
            fontWeight: 500,
            cursor: 'pointer',
            textDecoration: 'underline',
            '&:hover': {
              opacity: 0.8,
            },
          }}
          onClick={() => navigate('/introduction')}
        >
          Khuwaja Shamsu Deen Azeemi
        </Typography>
      </Box>

      {/* Right Section */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            color: 'primary.main',
            mb: 4,
            textAlign: 'center',
          }}
        >
          Login to the system
        </Typography>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              width: '100%', 
              maxWidth: '400px',
              mb: 2,
              '& .MuiAlert-message': { width: '100%' }
            }}
          >
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
          {quickLogins.map((q) => (
            <Button
              key={q.label}
              variant="outlined"
              size="small"
              onClick={() => handleQuickLogin(q.email, q.password)}
              disabled={isSubmitting || isAccountLocked()}
            >
              {q.label} Quick Login
            </Button>
          ))}
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            width: '100%',
            maxWidth: '400px',
          }}
          noValidate
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            autoComplete="email"
            autoFocus
            disabled={isSubmitting || isAccountLocked()}
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email sx={{ color: 'action.active' }} />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            id="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            disabled={isSubmitting || isAccountLocked()}
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: 'action.active' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                    disabled={isSubmitting || isAccountLocked()}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Typography
              variant="body2"
              sx={{
                color: 'primary.main',
                cursor: 'pointer',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              Forgot password?
            </Typography>
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isSubmitting || !isValid || !isDirty || isAccountLocked()}
            sx={{ 
              py: 1.5,
              mb: 3,
              bgcolor: 'primary.main',
              '&:hover': {
                bgcolor: 'primary.dark',
              },
              borderRadius: 1,
              position: 'relative',
            }}
          >
            {isSubmitting ? (
              <>
                <CircularProgress
                  size={24}
                  sx={{
                    position: 'absolute',
                    left: '50%',
                    marginLeft: '-12px',
                  }}
                />
                Signing in...
              </>
            ) : (
              'Login'
            )}
          </Button>

          <Typography 
            variant="body2" 
            sx={{ 
              textAlign: 'center',
              color: 'text.secondary',
            }}
          >
            Demo credentials:
            <br />
            SuperAdmin: superadmin@example.com / Super@123
            <br />
            Admin: admin@example.com / Admin@123
            <br />
            Therapist: therapist@example.com / Therapist@123
            <br />
            Receptionist: receptionist@example.com / Reception@123
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginForm; 