"use client"

import { useEffect } from "react"

const BACK_REDIRECT_URL = "https://meubackredirect.com.br"

export function BackRedirect() {
  useEffect(() => {
    const destination = new URL(BACK_REDIRECT_URL)
    const currentParams = new URLSearchParams(window.location.search)

    currentParams.forEach((value, key) => {
      destination.searchParams.set(key, value)
    })

    const redirectUrl = destination.toString()
    window.history.pushState({}, "", window.location.href)
    window.history.pushState({}, "", window.location.href)
    window.history.pushState({}, "", window.location.href)

    const handlePopState = () => {
      window.setTimeout(() => {
        window.location.assign(redirectUrl)
      }, 1)
    }

    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  return null
}
