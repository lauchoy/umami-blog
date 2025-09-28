import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
} from 'firebase/firestore'
import { db } from './config'
import { ShoppingList, Review, CookingSession, PaginatedResponse, UserPreferences, UserProfile } from '@/types'

// Shopping Lists
export async function createShoppingList(userId: string, name: string): Promise<string> {
  try {
    const shoppingList: Omit<ShoppingList, 'id'> = {
      userId,
      name,
      items: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const docRef = await addDoc(collection(db, 'shopping-lists'), shoppingList)
    return docRef.id
  } catch (error) {
    throw new Error(`Failed to create shopping list: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function getUserShoppingLists(userId: string): Promise<ShoppingList[]> {
  try {
    const q = query(
      collection(db, 'shopping-lists'),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    )

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as ShoppingList[]
  } catch (error) {
    throw new Error(`Failed to get shopping lists: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function updateShoppingList(listId: string, updates: Partial<ShoppingList>): Promise<void> {
  try {
    await updateDoc(doc(db, 'shopping-lists', listId), {
      ...updates,
      updatedAt: new Date(),
    })
  } catch (error) {
    throw new Error(`Failed to update shopping list: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function deleteShoppingList(listId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'shopping-lists', listId))
  } catch (error) {
    throw new Error(`Failed to delete shopping list: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Reviews
export async function createReview(review: Omit<Review, 'id' | 'createdAt'>): Promise<string> {
  try {
    const reviewData: Omit<Review, 'id'> = {
      ...review,
      createdAt: new Date(),
    }

    const docRef = await addDoc(collection(db, 'reviews'), reviewData)
    return docRef.id
  } catch (error) {
    throw new Error(`Failed to create review: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function getRecipeReviews(
  recipeId: string,
  pageSize: number = 10,
  lastDoc?: QueryDocumentSnapshot<DocumentData>
): Promise<PaginatedResponse<Review>> {
  try {
    let q = query(
      collection(db, 'reviews'),
      where('recipeId', '==', recipeId),
      orderBy('createdAt', 'desc'),
      limit(pageSize)
    )

    if (lastDoc) {
      q = query(q, startAfter(lastDoc))
    }

    const querySnapshot = await getDocs(q)
    const reviews = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Review[]

    // Get total count for pagination (simplified - in production, consider using aggregation)
    const totalQuery = query(collection(db, 'reviews'), where('recipeId', '==', recipeId))
    const totalSnapshot = await getDocs(totalQuery)

    return {
      data: reviews,
      pagination: {
        page: 1, // Would need to track this in a real implementation
        limit: pageSize,
        total: totalSnapshot.size,
        totalPages: Math.ceil(totalSnapshot.size / pageSize),
      },
    }
  } catch (error) {
    throw new Error(`Failed to get recipe reviews: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function getUserReviews(userId: string): Promise<Review[]> {
  try {
    const q = query(
      collection(db, 'reviews'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Review[]
  } catch (error) {
    throw new Error(`Failed to get user reviews: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Cooking Sessions
export async function startCookingSession(userId: string, recipeId: string): Promise<string> {
  try {
    const session: Omit<CookingSession, 'id'> = {
      userId,
      recipeId,
      currentStep: 0,
      startedAt: new Date(),
    }

    const docRef = await addDoc(collection(db, 'cooking-sessions'), session)
    return docRef.id
  } catch (error) {
    throw new Error(`Failed to start cooking session: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function updateCookingSession(sessionId: string, updates: Partial<CookingSession>): Promise<void> {
  try {
    await updateDoc(doc(db, 'cooking-sessions', sessionId), updates)
  } catch (error) {
    throw new Error(`Failed to update cooking session: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function completeCookingSession(sessionId: string, notes?: string, modifications?: string[]): Promise<void> {
  try {
    await updateDoc(doc(db, 'cooking-sessions', sessionId), {
      completedAt: new Date(),
      notes,
      modifications,
    })
  } catch (error) {
    throw new Error(`Failed to complete cooking session: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function getUserCookingSessions(userId: string): Promise<CookingSession[]> {
  try {
    const q = query(
      collection(db, 'cooking-sessions'),
      where('userId', '==', userId),
      orderBy('startedAt', 'desc')
    )

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as CookingSession[]
  } catch (error) {
    throw new Error(`Failed to get cooking sessions: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// User Preferences
export async function getUserPreferences(userId: string): Promise<UserPreferences | null> {
  try {
    const docRef = doc(db, 'user-preferences', userId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return docSnap.data() as UserPreferences
    }

    return null
  } catch (error) {
    throw new Error(`Failed to get user preferences: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function updateUserPreferences(userId: string, preferences: Partial<UserPreferences>): Promise<void> {
  try {
    const docRef = doc(db, 'user-preferences', userId)
    await updateDoc(docRef, {
      ...preferences,
      updatedAt: new Date(),
    })
  } catch (error) {
    throw new Error(`Failed to update user preferences: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function createUserPreferences(userId: string, preferences: UserPreferences): Promise<void> {
  try {
    const docRef = doc(db, 'user-preferences', userId)
    await updateDoc(docRef, {
      ...preferences,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  } catch (error) {
    throw new Error(`Failed to create user preferences: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// User Profiles
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const docRef = doc(db, 'user-profiles', userId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return docSnap.data() as UserProfile
    }

    return null
  } catch (error) {
    throw new Error(`Failed to get user profile: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function updateUserProfile(userId: string, profile: Partial<UserProfile>): Promise<void> {
  try {
    const docRef = doc(db, 'user-profiles', userId)
    await updateDoc(docRef, {
      ...profile,
      updatedAt: new Date(),
    })
  } catch (error) {
    throw new Error(`Failed to update user profile: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function createUserProfile(userId: string, profile: UserProfile): Promise<void> {
  try {
    const docRef = doc(db, 'user-profiles', userId)
    await updateDoc(docRef, {
      ...profile,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  } catch (error) {
    throw new Error(`Failed to create user profile: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Generic helpers
export async function getDocument<T>(collectionName: string, docId: string): Promise<T | null> {
  try {
    const docRef = doc(db, collectionName, docId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T
    }

    return null
  } catch (error) {
    throw new Error(`Failed to get document: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}