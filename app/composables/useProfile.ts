// Shared access to the home hero front-matter (name, role, contact links),
// loaded once and cached across components for the static build.
export interface ProfileContact {
  email?: string
  linkedin?: string
  github?: string
  blog?: string
  twitter?: string
}

export interface Profile {
  name: string
  role?: string
  tagline?: string
  location?: string
  contact: ProfileContact
}

export function useProfile() {
  return useAsyncData<Profile>('profile', async () => {
    const hero = await queryCollection('home').path('/home/hero').first()
    return {
      name: hero?.title ?? 'Sankar Vema',
      role: (hero as any)?.role,
      tagline: (hero as any)?.tagline,
      location: (hero as any)?.location,
      contact: ((hero as any)?.contact ?? {}) as ProfileContact,
    }
  })
}
