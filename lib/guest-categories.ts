// Roles used to identify guests in the Guest Arrivals list.
// Shared by the public /arrivals page and the admin dashboard.
export const GUEST_CATEGORIES = [
  'Principal Sponsors',
  'Team Groom',
  'Team Bride',
  'Guests',
  'Parents',
  'Family Member',
  'Siblings',
  'Friends',
] as const

export type GuestCategory = (typeof GUEST_CATEGORIES)[number]
