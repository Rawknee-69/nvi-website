import { useUser } from '@clerk/clerk-react';
type UserResource = NonNullable<ReturnType<typeof useUser>['user']>;
const x: UserResource | null = null;
