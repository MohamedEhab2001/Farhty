import axios from 'axios'
import { SdkConfig } from '../types'

let _apiBase = 'http://localhost:3001'

export async function loadConfig(): Promise<SdkConfig> {
  try {
    const res = await fetch('/config.json')
    const cfg: SdkConfig = await res.json()
    _apiBase = cfg.apiBase || _apiBase
    return cfg
  } catch {
    return { apiBase: _apiBase }
  }
}

export function getApiBase() { return _apiBase }

export const api = axios.create({ baseURL: _apiBase })

// Re-apply baseURL after config loads
export function setApiBase(base: string) {
  _apiBase = base
  api.defaults.baseURL = base
}
