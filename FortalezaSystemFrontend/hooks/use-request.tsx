import { useEffect, useState } from "react"
import axios, { AxiosRequestConfig } from "axios"

export function useFetch<T = any>(url: string, config?: AxiosRequestConfig) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<unknown>(null)

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await axios.get<T>(url, config)
        if (isMounted) {
          setData(response.data)
        }
      } catch (err) {
        if (isMounted) {
          setError(err)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, [url])

  return { data, loading, error }
}
