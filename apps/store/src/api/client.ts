import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
})

export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '00201027708044'
