import React, { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  doc, 
  setDoc, 
  deleteDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { Database, FileText, Plus, Trash2, CheckCircle2, AlertCircle, Sparkles, Lock } from 'lucide-react';

interface NoteItem {
  id: string;
  repoId: string;
  repoName: string;
  userId: string;
  note: string;
  status: 'todo' | 'in_review' | 'resolved';
  createdAt?: any;
}

interface FirebaseNotesWidgetProps {
  repoId?: string;
  repoName?: string;
}

export const FirebaseNotesWidget: React.FC<FirebaseNotesWidgetProps> = ({ 
  repoId = 'repo-core-api', 
  repoName = 'khulnasoft/core-api-service' 
}) => {
  const { user, firebaseUser, loginWithGoogle } = useAuth();
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [newNoteText, setNewNoteText] = useState('');
  const [status, setStatus] = useState<'todo' | 'in_review' | 'resolved'>('todo');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Subscribe to real-time Firestore updates for user notes
  useEffect(() => {
    if (!user || !firebaseUser) {
      setNotes([]);
      return;
    }

    const path = 'repositoryNotes';
    const notesQuery = query(
      collection(db, path),
      where('userId', '==', user.id)
    );

    const unsubscribe = onSnapshot(
      notesQuery,
      (snapshot) => {
        const fetchedNotes: NoteItem[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as NoteItem[];
        setNotes(fetchedNotes);
        setErrorMsg(null);
      },
      (error) => {
        try {
          handleFirestoreError(error, OperationType.GET, path);
        } catch (e: any) {
          setErrorMsg('Firestore access error: ' + (e.message || 'Permission denied'));
        }
      }
    );

    return () => unsubscribe();
  }, [user, firebaseUser]);

  // Create or Update Note
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim() || !user) return;

    setIsSaving(true);
    setErrorMsg(null);
    const noteId = `note-${Date.now()}`;
    const path = 'repositoryNotes';

    try {
      await setDoc(doc(db, path, noteId), {
        id: noteId,
        repoId,
        repoName,
        userId: user.id,
        note: newNoteText.trim().substring(0, 2000),
        status,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setNewNoteText('');
    } catch (err) {
      try {
        handleFirestoreError(err, OperationType.WRITE, path);
      } catch (e: any) {
        setErrorMsg('Failed to save note to Firestore. ' + (e.message || 'Check Firestore rules.'));
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Note
  const handleDeleteNote = async (noteId: string) => {
    if (!user) return;
    const path = 'repositoryNotes';
    try {
      await deleteDoc(doc(db, path, noteId));
    } catch (err) {
      try {
        handleFirestoreError(err, OperationType.DELETE, path);
      } catch (e: any) {
        setErrorMsg('Failed to delete note: ' + (e.message || 'Error occurred'));
      }
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <Database className="w-4 h-4 text-amber-400" />
          <h3 className="font-bold text-slate-100 text-sm">Firestore Persisted Repository Notes</h3>
        </div>
        <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800/80 text-[10px] font-bold">
          Cloud Firestore Active
        </span>
      </div>

      {!firebaseUser ? (
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-3">
          <p className="text-slate-400 text-xs">Sign in with Google or OIDC to create and sync real-time database notes across sessions.</p>
          <button
            onClick={loginWithGoogle}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs inline-flex items-center space-x-2 cursor-pointer transition-all shadow-md shadow-amber-500/20"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Sign In with Google</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 flex items-center space-x-2 text-[11px]">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* New Note Form */}
          <form onSubmit={handleAddNote} className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder={`Add operational note for ${repoName}...`}
                className="flex-1 bg-slate-950 border border-slate-800 focus:border-amber-400 rounded-xl px-3.5 py-2 text-slate-200 placeholder-slate-500 text-xs outline-none transition-colors"
                maxLength={2000}
              />
              <select
                value={status}
                onChange={(e: any) => setStatus(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-2.5 py-2 text-xs outline-none"
              >
                <option value="todo">Todo</option>
                <option value="in_review">In Review</option>
                <option value="resolved">Resolved</option>
              </select>
              <button
                type="submit"
                disabled={isSaving || !newNoteText.trim()}
                className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold px-3.5 py-2 rounded-xl flex items-center space-x-1 cursor-pointer transition-all shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Save</span>
              </button>
            </div>
          </form>

          {/* Notes List */}
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {notes.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-slate-500 text-center text-xs">
                No Firestore notes created yet for this account. Create one above to test live persistence!
              </div>
            ) : (
              notes.map((n) => (
                <div
                  key={n.id}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-colors"
                >
                  <div className="space-y-0.5 max-w-[80%]">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-200">{n.repoName || repoName}</span>
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${
                        n.status === 'resolved' 
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                          : n.status === 'in_review'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                      }`}>
                        {n.status}
                      </span>
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed">{n.note}</p>
                  </div>

                  <button
                    onClick={() => handleDeleteNote(n.id)}
                    className="p-1.5 rounded-lg hover:bg-rose-950 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                    title="Delete Note from Firestore"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
