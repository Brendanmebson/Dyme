// src/controllers/auth.controller.js
import { z } from 'zod';
import { supabase } from '../lib/supabase.js';

// ── Schemas ───────────────────────────────────────────────────
const RegisterSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// ── Register ──────────────────────────────────────────────────
export const register = async (req, res) => {
  try {
    const body = RegisterSchema.parse(req.body);

    console.log("REGISTER BODY:", body);

    const { data, error } = await supabase.auth.signUp({
      email: body.email,
      password: body.password,
      options: {
        data: { full_name: body.full_name },
      },
    });

    console.log("REGISTER ERROR:", error);
    console.log("REGISTER DATA:", data);

    if (error) {
      if (error.code === 'email_exists') {
        return res.status(409).json({ error: 'Email already in use' });
      }
      return res.status(400).json({ error: error.message });
    }

    const user = data.user;

    // ✅ Create profile (IMPORTANT)
    const { error: profileError } = await supabase.from('profiles').upsert({
      id: user.id,
      full_name: body.full_name,
    });

    if (profileError) {
      console.log("PROFILE ERROR:", profileError);
    }

    return res.status(201).json({
      user: { id: user.id, full_name: body.full_name, email: body.email },
      session: data.session,
    });

  } catch (err) {
    console.log("REGISTER CATCH ERROR:", err);
    return res.status(400).json({ error: err.message });
  }
};

// ── Login ─────────────────────────────────────────────────────
export const login = async (req, res) => {
  try {
    const body = LoginSchema.parse(req.body);

    console.log("LOGIN BODY:", body);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: body.email,
      password: body.password,
    });

    // 🔥 CRITICAL DEBUG LOGS
    console.log("LOGIN ERROR:", error);
    console.log("LOGIN DATA:", data);

    if (error) {
      return res.status(401).json({ error: error.message });
    }

    if (!data.user) {
      return res.status(401).json({ error: 'No user returned' });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    return res.json({
      user: profile ? { ...profile, email: data.user.email } : data.user,
      session: data.session,
    });

  } catch (err) {
    console.log("LOGIN CATCH ERROR:", err);
    return res.status(400).json({ error: err.message });
  }
};

// ── Logout ────────────────────────────────────────────────────
export const logout = async (req, res) => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  return res.json({ message: 'Logged out successfully' });
};

// ── Get current user ──────────────────────────────────────────
export const getMe = async (req, res) => {
  try {
    console.log("REQ.USER:", req.user);

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', req.user.id)
      .single();

    console.log("PROFILE ERROR:", error);
    console.log("PROFILE DATA:", profile);

    if (error || !profile) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({ user: { ...profile, email: req.user.email } });

  } catch (err) {
    console.log("GETME ERROR:", err);
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

// ── Update profile ────────────────────────────────────────────
export const updateMe = async (req, res) => {
  try {
    const UpdateSchema = z.object({
      full_name: z.string().min(2).optional(),
      currency: z.string().length(3).optional(),
      timezone: z.string().optional(),
      avatar_url: z.string().optional(),
    });

    const body = UpdateSchema.parse(req.body);

    const { data, error } = await supabase
      .from('profiles')
      .update(body)
      .eq('id', req.user.id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.json({ user: { ...data, email: req.user.email } });

  } catch (err) {
    console.log("UPDATE ERROR:", err);
    return res.status(400).json({ error: err.message });
  }
};

// ── Change password ───────────────────────────────────────────
export const changePassword = async (req, res) => {
  try {
    const Schema = z.object({
      new_password: z.string().min(8),
    });

    const { new_password } = Schema.parse(req.body);

    const { error } = await supabase.auth.updateUser({
      password: new_password,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.json({ message: 'Password updated successfully' });

  } catch (err) {
    console.log("CHANGE PASSWORD ERROR:", err);
    return res.status(400).json({ error: err.message });
  }
};

// ── Update avatar ─────────────────────────────────────────────
export const updateAvatar = async (req, res) => {
  try {
    const { image } = req.body; // base64 data URL
    if (!image) return res.status(400).json({ error: 'No image provided' });

    // 1. Decode base64
    const base64Data = image.split(',')[1];
    const buffer = Buffer.from(base64Data, 'base64');
    const contentType = image.split(';')[0].split(':')[1];
    const extension = contentType.split('/')[1];
    const fileName = `${req.user.id}-${Date.now()}.${extension}`;

    // 2. Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, buffer, {
        contentType,
        upsert: true,
      });

    if (uploadError) throw uploadError;

    // 3. Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    // 4. Update profile in DB
    const { data: updatedProfile, error: dbError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', req.user.id)
      .select()
      .single();

    if (dbError) throw dbError;

    return res.json({ user: { ...updatedProfile, email: req.user.email } });

  } catch (err) {
    console.log("UPDATE AVATAR ERROR:", err);
    return res.status(400).json({ error: err.message });
  }
};