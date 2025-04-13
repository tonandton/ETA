import {
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import React, { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { data, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuthState } from "react-firebase-hooks/auth";
import api from "../libs/apiCall";
import { auth } from "../libs/firebaseConfig";
import useStore from "../store";
import { Button } from "./ui/button";

export const SocialAuth = ({ isLoading, setLoading }) => {
  const [user] = useAuthState(auth);
  const [selectedProvider, setSelectedProvider] = useState("google");
  const [firebaseUser, setFirebaseUser] = useState(null);
  const { setCredentials } = useStore((state) => state);
  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    setSelectedProvider("google");

    try {
      const res = await signInWithPopup(auth, provider);
      setFirebaseUser(res.user);
    } catch (err) {
      console.error("Error signing in with Google", err);
    }
  };

  // const signInWithGithub = async () => {};

  useEffect(() => {
    const saveUserToDb = async () => {
      try {
        const userData = {
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          provider: selectedProvider,
          uid: firebaseUser.uid,
        };

        setLoading(true);
        const { data: res } = await api.post("/auth/sign-in-oauth", userData);
        console.log(res);

        if (res?.user) {
          toast.success(res?.message);
          const userinfo = { ...res?.user, token: res?.token };
          localStorage.setItem("user", JSON.stringify(userinfo));

          setCredentials(userinfo);

          setTimeout(() => {
            navigate("overview");
          }, 1500);
        }
      } catch (err) {
        console.error("Something went wrong", err);
        toast.error(err?.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    if (firebaseUser) saveUserToDb();
  }, [firebaseUser?.uid]);

  return (
    <div className="flex item-center gap-2">
      <Button
        onClick={signInWithGoogle}
        disabled={isLoading}
        variant="outline"
        className="w-full text-sm font-normal dark:bg-transparent dark:border-gray-800 dark:text-gray-400"
        type="button"
      >
        <FcGoogle className="mr-2 size-5" />
        Continue with Google
      </Button>
    </div>
  );
};
