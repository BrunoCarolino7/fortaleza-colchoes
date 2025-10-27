import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatToBRL(value?: number | string | null): string {
  if (value === null || value === undefined || value === "") return "";
  const number = typeof value === "string" ? parseFloat(value) : value;
  return number.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function formatDateBR(date?: Date | string | number | null): string {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatDateTimeBR(date?: Date | string | number | null): string {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatCPF(value?: string | null): string {
  if (!value) return "";
  const digits = value.replace(/\D/g, "").padStart(11, "0");
  if (digits.length !== 11) return value;

  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

export function formatRG(value?: string | null): string {
  if (!value) return "";
  const digits = value.replace(/\D/g, "").padStart(9, "0");
  if (digits.length < 8 || digits.length > 9) return value;

  return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, "$1.$2.$3-$4");
}

export function formatCEP(value?: string | null): string {
  if (!value) return "";
  const digits = value.replace(/\D/g, "").padStart(8, "0");
  if (digits.length !== 8) return value;

  return digits.replace(/(\d{5})(\d{3})/, "$1-$2");
}

export function formatPhoneNumber(phone?: string): string {
  if (!phone) return "-";

  const digits = phone.replace(/\D/g, "");

  if (digits.length === 0) return "-";

  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }

  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  if (digits.length === 9) {
    return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  }

  if (digits.length === 8) {
    return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  }

  return digits;
}
