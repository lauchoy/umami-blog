import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser,
  UserCredential,
} from 'firebase/auth'
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from './config'
import { User, UserPreferences } from '@/types'

const googleProvider = new GoogleAuthProvider()

export async function signUp(email: string, password: string, displayName: string): Promise<User> {
  try {
    const { user }: UserCredential = await createUserWithEmailAndPassword(auth, email, password)

    // Update the user's display name
    await updateProfile(user, { displayName })

    // Create user document in Firestore
    const userData: User = {
      id: user.uid,
      email: user.email!,
      displayName,
      preferences: getDefaultPreferences(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await setDoc(doc(db, 'users', user.uid), userData)

    return userData
  } catch (error) {
    throw new Error(`Sign up failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function signIn(email: string, password: string): Promise<User> {
  try {
    const { user }: UserCredential = await signInWithEmailAndPassword(auth, email, password)
    const userData = await getUserData(user.uid)
    return userData
  } catch (error) {
    throw new Error(`Sign in failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function signInWithGoogle(): Promise<User> {
  try {
    const { user }: UserCredential = await signInWithPopup(auth, googleProvider)

    // Check if user already exists
    const userDoc = await getDoc(doc(db, 'users', user.uid))

    if (!userDoc.exists()) {
      // Create new user document
      const userData: User = {
        id: user.uid,
        email: user.email!,
        displayName: user.displayName || user.email!.split('@')[0],
        avatar: user.photoURL || undefined,
        preferences: getDefaultPreferences(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      await setDoc(doc(db, 'users', user.uid), userData)
      return userData
    } else {
      return userDoc.data() as User
    }
  } catch (error) {
    throw new Error(`Google sign in failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function logOut(): Promise<void> {
  try {
    await signOut(auth)
  } catch (error) {
    throw new Error(`Sign out failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function getUserData(userId: string): Promise<User> {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId))
    if (!userDoc.exists()) {
      throw new Error('User not found')
    }
    return userDoc.data() as User
  } catch (error) {
    throw new Error(`Failed to get user data: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function updateUserPreferences(userId: string, preferences: Partial<UserPreferences>): Promise<void> {
  try {
    await updateDoc(doc(db, 'users', userId), {
      preferences,
      updatedAt: new Date(),
    })
  } catch (error) {
    throw new Error(`Failed to update preferences: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export function onAuthStateChange(callback: (user: FirebaseUser | null) => void): () => void {
  return onAuthStateChanged(auth, callback)
}

function getDefaultPreferences(): UserPreferences {
  return {
    dietaryRestrictions: [],
    cuisinePreferences: [],
    skillLevel: 'beginner',
    cookingTime: '30min',
    allergies: [],
    dislikedIngredients: [],
  }
}

export { auth }
export type { FirebaseUser }