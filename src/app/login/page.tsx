"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { getProviders, signIn } from "next-auth/react";
import { GraduationCap, Mail, Lock, Chrome } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Suspense } from "react";

function LoginForm() {
 