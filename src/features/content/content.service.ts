import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where,
  orderBy,
  Timestamp,
  getDoc
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Content, ContentFilter, ArticleContent, VideoContent } from "./content.types";

const COLLECTION_NAME = "contents";

export const contentService = {
  // Get all contents with optional filters
  async getContents(filter?: ContentFilter): Promise<Content[]> {
    const contentsRef = collection(db, COLLECTION_NAME);
    let q = query(contentsRef, orderBy("createdAt", "desc"));

    if (filter?.type) {
      q = query(q, where("type", "==", filter.type));
    }

    if (filter?.status) {
      q = query(q, where("status", "==", filter.status));
    }

    if (filter?.category && filter.category !== 'all') {
      q = query(q, where("category", "==", filter.category));
    }

    const snapshot = await getDocs(q);
    const contents = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Content[];

    // Client-side search filtering (since Firestore doesn't support full-text search natively)
    if (filter?.search) {
      const searchLower = filter.search.toLowerCase();
      return contents.filter(content => 
        content.title.toLowerCase().includes(searchLower) ||
        (content.type === 'article' && (content as ArticleContent).excerpt.toLowerCase().includes(searchLower))
      );
    }

    return contents;
  },

  // Get single content by ID
  async getContent(id: string): Promise<Content | null> {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Content;
    }
    return null;
  },

  // Create new content
  async createContent(content: Omit<Content, "id" | "createdAt" | "updatedAt">): Promise<Content> {
    const now = new Date().toISOString();
    const newContent = {
      ...content,
      createdAt: now,
      updatedAt: now,
      views: 0
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), newContent);
    return { id: docRef.id, ...newContent } as Content;
  },

  // Update existing content
  async updateContent(id: string, updates: Partial<Content>): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  },

  // Delete content
  async deleteContent(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  },

  // Increment views
  async incrementViews(id: string, currentViews: number): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      views: currentViews + 1
    });
  }
};
