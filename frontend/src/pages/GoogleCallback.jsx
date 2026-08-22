import { useEffect, useState } from "react";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import api, { AUTH } from "../services/api";
import { useAuth } from "../context/AuthContext";

const GoogleCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { setUser } = useAuth();

  const [error, setError] = useState("");

  useEffect(() => {
    const handleGoogleLogin = async () => {
      const code = searchParams.get("code");

      if (!code) {
        setError("Google authorization failed");
        return;
      }

      try {
        const response = await api.post(
          AUTH.GOOGLE_LOGIN,
          { code }
        );

        setUser(response.data.user);

        navigate("/coins", {
          replace: true,
        });
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Google login failed"
        );
      }
    };

    handleGoogleLogin();
  }, [searchParams, navigate, setUser]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
        <div className="w-full max-w-md rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-center text-red-400">
          {error}

          <button
            onClick={() => navigate("/login")}
            className="mt-4 block w-full rounded-lg bg-slate-800 py-2 text-white"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
      <div className="text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-slate-700 border-t-emerald-400" />

        <p className="text-slate-300">
          Signing in with Google...
        </p>
      </div>
    </div>
  );
};

export default GoogleCallback;