import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api";
import Notification from "./../../components/Notification";
import useNotification from "../../hooks/useNotification";

const ResetPassword = () => {
  const { uid, token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  const [isValidating, setIsValidating] = useState(true); // Add a state to track validation process
  const navigate = useNavigate();

  const notificationTimerRef = useRef(null);

  // Use the notification hook
  const { notification, showNotification, hideNotification, setNotification } =
    useNotification();

  // Password validation state
  const [passwordErrors, setPasswordErrors] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  // Helper to show notification and auto-hide it after a delay
  const displayAutoDismissNotification = useCallback(
    (message, type, duration = 5000) => {
      if (notificationTimerRef.current) {
        clearTimeout(notificationTimerRef.current); // Clear existing timer
      }
      showNotification(message, type); // Show the new notification

      if (duration > 0) {
        // Only set a timer if duration is positive
        notificationTimerRef.current = setTimeout(() => {
          hideNotification();
          notificationTimerRef.current = null; // Reset ref after execution
        }, duration);
      }
    },
    [showNotification, hideNotification]
  ); // Dependencies

  // Cleanup for the notification timer on component unmount
  useEffect(() => {
    return () => {
      if (notificationTimerRef.current) {
        clearTimeout(notificationTimerRef.current);
      }
    };
  }, []);

  // Validate token on component mount
  useEffect(() => {
    let isMounted = true; // For handling unmounted component

    // Validate that we have both parameters
    if (!uid || !token) {
      setTokenValid(false);
      setIsValidating(false);
      displayAutoDismissNotification("Invalid password reset link.", "error");
      return;
    }

    // Verify token validity with the backend
    const verifyToken = async () => {
      setIsValidating(true);
      try {
        // OPTION 1: For testing with a backend endpoint
        await api.get(`/accounts/validate-reset-token/${uid}/${token}/`);
        if (isMounted) {
          setTokenValid(true);
          console.log("Token validation successful");
        }

        // OPTION 2: For testing without a backend endpoint (comment out Option 1 and uncomment this)
        // console.log('Token validation skipped for testing');
        // if (isMounted) {
        //   setTokenValid(true);
        // }
      } catch (error) {
        console.error("Token validation error:", error);
        if (isMounted) {
          setTokenValid(false);
          displayAutoDismissNotification(
            error.response?.data?.error ||
              "This password reset link has expired or is invalid.",
            "error"
          );
        }
      } finally {
        if (isMounted) {
          setIsValidating(false);
        }
      }
    };

    verifyToken();

    return () => {
      isMounted = false; // Cleanup to prevent state updates on unmounted component
    };
  }, [uid, token, displayAutoDismissNotification]);

  // Password validation function
  const validatePassword = (password) => {
    const errors = {
      length: password.length < 8,
      uppercase: !/[A-Z]/.test(password),
      lowercase: !/[a-z]/.test(password),
      number: !/[0-9]/.test(password),
      special: !/[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    setPasswordErrors(errors);
    return !Object.values(errors).some((error) => error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Double-check token validity - prevent submissions if token is invalid
    if (!tokenValid) {
      displayAutoDismissNotification(
        "This password reset link is invalid or has expired.",
        "error"
      );
      return;
    }

    // Validate password strength
    if (!validatePassword(password)) {
      displayAutoDismissNotification(
        "Please ensure your password meets all requirements.",
        "error"
      );
      return;
    }

    if (password !== confirmPassword) {
      displayAutoDismissNotification("Passwords do not match", "error");
      return;
    }

    setLoading(true);

    try {
      await api.post(`/accounts/reset-password/${uid}/${token}/`, {
        password: password,
      });

      // Handle success
      displayAutoDismissNotification(
        "Your password has been successfully reset.",
        "success"
      );
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      // Handle error
      console.error("Password reset error:", error);
      displayAutoDismissNotification(
        error.response?.data?.error || "An error occurred. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  if (isValidating) {
    return (
      <div className='main-container'>
        <Notification
          notification={notification}
          setNotification={setNotification}
        />
        <div className='loading-indicator'>
          <p>Validating your reset link...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='main-container'>
      <Notification
        notification={notification}
        setNotification={setNotification}
      />

      {tokenValid ? (
        <>
          <form className='auth-form' onSubmit={handleSubmit}>
            <section className='title'>
              <h1>Reset Your Password</h1>
            </section>
            <div>
              <label>New Password:</label>
              <input
                className='form-input'
                type='password'
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  validatePassword(e.target.value);
                }}
                required
              />

              {/* Password requirements display */}
              <div className='password-requirements'>
                <p className={passwordErrors.length ? "invalid" : "valid"}>
                  At least 8 characters
                </p>
                <p className={passwordErrors.uppercase ? "invalid" : "valid"}>
                  At least one uppercase letter
                </p>
                <p className={passwordErrors.lowercase ? "invalid" : "valid"}>
                  At least one lowercase letter
                </p>
                <p className={passwordErrors.number ? "invalid" : "valid"}>
                  At least one number
                </p>
                <p className={passwordErrors.special ? "invalid" : "valid"}>
                  At least one special character
                </p>
              </div>
            </div>

            <div>
              <label>Confirm New Password:</label>
              <input
                className='form-input'
                type='password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button type='submit' disabled={loading || !tokenValid}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </>
      ) : (
        <div className='invalid-token'>
          <section className='title'>
            <h1>Invalid Reset Link</h1>
          </section>
          <p>
            This password reset link is invalid or has expired. Please request a
            new one.
          </p>
          <button
            onClick={() => navigate("/forgot-password")}
            className='secondary-button'>
            Request New Reset Link
          </button>
        </div>
      )}
    </div>
  );
};

export default ResetPassword;
