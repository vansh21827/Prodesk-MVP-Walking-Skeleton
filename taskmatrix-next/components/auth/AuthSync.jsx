"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import {
  setCredentials,
  logout,
} from "@/store/authSlice";

export default function AuthSync() {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      dispatch(
        setCredentials({
          user: {
            id: session.user.id,
            name: session.user.name,
            email: session.user.email,
            role: session.user.role,
            avatar: session.user.avatar,
          },
          token: session.user.accessToken,
        })
      );
    }

    if (status === "unauthenticated") {
      dispatch(logout());
    }
  }, [session, status, dispatch]);

  return null;
}