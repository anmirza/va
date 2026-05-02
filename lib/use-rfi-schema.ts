/**
 * use-rfi-schema.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * React hook that loads a category's RfiField[] from Firestore and exposes
 * helpers used by the agency / production forms to make built-in fields
 * editable (visibility, label, placeholder, required) and to surface any
 * admin-added custom fields per step.
 */

'use client'

import { useEffect, useMemo, useState } from 'react'
import { getRfiFieldsFS } from '@/lib/admin-firestore'
import type { RfiField } from '@/lib/admin-store'
import { RFI_SCHEMA_SEEDS } from '@/lib/rfi-schema-seed'

export interface RfiSchemaApi {
  fields: RfiField[]
  loaded: boolean

  /** Look up a built-in field by its id. */
  getField: (id: string) => RfiField | undefined
  /** True if the field is visible (default true if undefined). */
  isVisible: (id: string) => boolean
  /** Label for the field (admin override, otherwise fallback). */
  getLabel: (id: string, fallback: string) => string
  /** Placeholder for the field (admin override, otherwise fallback). */
  getPlaceholder: (id: string, fallback?: string) => string | undefined
  /** Required flag (admin override, otherwise fallback). */
  isRequired: (id: string, fallback: boolean) => boolean

  /** All admin-added custom fields targeting a given step (sorted). */
  customFieldsForStep: (stepKey: string) => RfiField[]
  /** All visible fields targeting a step grouped by sub-section. */
  customFieldsBySubSection: (stepKey: string) => Record<string, RfiField[]>
}

export function useRfiSchema(categoryId: string): RfiSchemaApi {
  const [fields, setFields] = useState<RfiField[]>(() => RFI_SCHEMA_SEEDS[categoryId] ?? [])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false
    getRfiFieldsFS(categoryId)
      .then(remote => {
        if (cancelled) return
        if (Array.isArray(remote) && remote.length > 0) {
          setFields(remote)
        } else {
          // No remote data — use seed as the working schema.
          setFields(RFI_SCHEMA_SEEDS[categoryId] ?? [])
        }
        setLoaded(true)
      })
      .catch(() => {
        if (!cancelled) {
          setFields(RFI_SCHEMA_SEEDS[categoryId] ?? [])
          setLoaded(true)
        }
      })
    return () => {
      cancelled = true
    }
  }, [categoryId])

  return useMemo<RfiSchemaApi>(() => {
    const byId = new Map<string, RfiField>()
    for (const f of fields) byId.set(f.id, f)

    const customByStep = new Map<string, RfiField[]>()
    for (const f of fields) {
      if (f.isSystem) continue
      if (!f.stepKey) continue
      if (f.visible === false) continue
      const list = customByStep.get(f.stepKey) ?? []
      list.push(f)
      customByStep.set(f.stepKey, list)
    }
    for (const list of customByStep.values()) {
      list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    }

    return {
      fields,
      loaded,
      getField: (id) => byId.get(id),
      isVisible: (id) => byId.get(id)?.visible !== false,
      getLabel: (id, fallback) => byId.get(id)?.label ?? fallback,
      getPlaceholder: (id, fallback) => byId.get(id)?.placeholder ?? fallback,
      isRequired: (id, fallback) => byId.get(id)?.required ?? fallback,
      customFieldsForStep: (stepKey) => customByStep.get(stepKey) ?? [],
      customFieldsBySubSection: (stepKey) => {
        const grouped: Record<string, RfiField[]> = {}
        for (const f of customByStep.get(stepKey) ?? []) {
          const key = f.subSectionKey ?? '__root__'
          ;(grouped[key] ||= []).push(f)
        }
        return grouped
      },
    }
  }, [fields, loaded])
}
