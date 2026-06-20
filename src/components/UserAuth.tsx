import React, { useState, useEffect } from "react";
import { User, Lock, Shield, LogOut, Check, Star, Trash2 } from "lucide-react";
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, handleFirestoreError, OperationType } from "../lib/firebase";
import { useLanguage } from "../lib/LanguageContext";

export interface RobloxUser {
  uid?: string;
  email?: string;
  username: string;
  avatarType: string;
  avatarColor: string;
  joinedDate: string;
  simulatedRobux: number;
  avatarUrl?: string; // AI generated custom avatar url
}

interface UserAuthProps {
  onLogin: (user: RobloxUser) => void;
  onLogout: () => void;
  currentUser: RobloxUser | null;
}

export default function UserAuth({ onLogin, onLogout, currentUser }: UserAuthProps) {
  const { language, t } = useLanguage();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [selectedAvatar, setSelectedAvatar] = useState<string>("Classic Noob");
  const [registeredUsers, setRegisteredUsers] = useState<Record<string, { passwordHash: string; userObj: RobloxUser }>>({});
  const [errorText, setErrorText] = useState<string>("");
  const [successText, setSuccessText] = useState<string>("");

  // Firebase Authentication states
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [needsProfileSetup, setNeedsProfileSetup] = useState<boolean>(false);
  const [isLinking, setIsLinking] = useState<boolean>(false);

  const PRESET_AVATARS = [
    { 
      type: "Classic Noob", 
      color: "from-yellow-450 to-blue-600 bg-yellow-400", 
      desc: t("auth_desc_classic_noob") || "The legendary yellow torso with green pants.", 
      initials: "NB" 
    },
    { 
      type: "Bacon Hair", 
      color: "from-amber-700 to-stone-500 bg-stone-750", 
      desc: t("auth_desc_bacon_hair") || "The ultimate classic citizen hair style.", 
      initials: "BH" 
    },
    { 
      type: "Guest 1337", 
      color: "from-neutral-850 to-red-600 bg-black", 
      desc: t("auth_desc_guest") || "The silent observer wearing the Roblox cap.", 
      initials: "G1" 
    },
    { 
      type: "Valkyrie Overlord", 
      color: "from-indigo-600 to-rose-500 bg-indigo-950", 
      desc: t("auth_desc_valk") || "Equipped with the high-society status wings.", 
      initials: "VK" 
    },
    { 
      type: "Builderman", 
      color: "from-orange-500 to-blue-900 bg-orange-600", 
      desc: t("auth_desc_builder") || "Armed with a hardhat and physical bricks.", 
      initials: "BM" 
    },
    { 
      type: "David.baszucki", 
      color: "from-red-650 to-neutral-900 bg-neutral-950", 
      desc: t("auth_desc_founder") || "The ultimate visionary founder profile look.", 
      initials: "DB" 
    },
  ];

  // Monitor Firebase Auth state transitions
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fUser) => {
      setFirebaseUser(fUser);
      if (fUser) {
        try {
          const userDocRef = doc(db, "users", fUser.uid);
          const userSnap = await getDoc(userDocRef);
          
          if (userSnap.exists()) {
            const profileData = userSnap.data() as RobloxUser;
            onLogin({
              ...profileData,
              uid: fUser.uid,
              email: fUser.email || "",
            });
            setNeedsProfileSetup(false);
          } else {
            // Authentic first-time user mapped to Google sign in but lacks a Roblox avatar
            setNeedsProfileSetup(true);
            setIsOpen(true);
          }
        } catch (error) {
          console.error("Failed to load Firebase user profile:", error);
        }
      } else {
        setNeedsProfileSetup(false);
      }
    });

    return unsub;
  }, [onLogin]);

  // Load custom global context hooks
  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
    };
    window.addEventListener("roblox-open-auth", handleOpen);
    return () => window.removeEventListener("roblox-open-auth", handleOpen);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("roblox_archives_users");
    if (saved) {
      try {
        setRegisteredUsers(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse cached users", e);
      }
    } else {
      const seed: Record<string, { passwordHash: string; userObj: RobloxUser }> = {
        builderman: {
          passwordHash: "classic2006",
          userObj: {
            username: "builderman",
            avatarType: "Builderman",
            avatarColor: "from-orange-500 to-blue-900 bg-orange-600",
            joinedDate: "Mar 2006",
            simulatedRobux: 2500000,
          },
        },
        classic_guest: {
          passwordHash: "unlocked",
          userObj: {
            username: "ClassicGuest",
            avatarType: "Guest 1337",
            avatarColor: "from-neutral-850 to-red-600 bg-black",
            joinedDate: "Sep 2008",
            simulatedRobux: 100,
          },
        },
      };
      localStorage.setItem("roblox_archives_users", JSON.stringify(seed));
      setRegisteredUsers(seed);
    }
  }, []);

  const handleGoogleSignIn = async () => {
    setErrorText("");
    setSuccessText("");
    try {
      const provider = new GoogleAuthProvider();
      setSuccessText(t("auth_gateway"));
      await signInWithPopup(auth, provider);
      setSuccessText(t("auth_google_verified"));
    } catch (error: any) {
      setErrorText(error?.message || "Failed to authenticate with Google.");
    }
  };

  const handleCompleteSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firebaseUser) return;
    setErrorText("");
    setSuccessText("");

    const rName = username.trim();
    if (!rName || rName.length < 3) {
      setErrorText(t("auth_err_handle_len"));
      return;
    }
    if (rName.toLowerCase() !== rName.replace(/[^a-z0-9_]/g, "")) {
      setErrorText(t("auth_err_handle_chars"));
      return;
    }

    setIsLinking(true);
    try {
      const avatar = PRESET_AVATARS.find((a) => a.type === selectedAvatar) || PRESET_AVATARS[0];
      const starterProfile = {
        username: rName,
        avatarType: avatar.type,
        avatarColor: avatar.color,
        joinedDate: new Date().toLocaleDateString(language === "th" ? "th-TH" : "en-US", { month: "short", year: "numeric" }),
        simulatedRobux: 3000000, // 3 Million starting fallback Robux
      };

      const userDocRef = doc(db, "users", firebaseUser.uid);
      await setDoc(userDocRef, {
        ...starterProfile,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      onLogin({
        ...starterProfile,
        uid: firebaseUser.uid,
        email: firebaseUser.email || "",
      });

      setSuccessText(t("auth_complete_db_lock"));
      setNeedsProfileSetup(false);
      
      setTimeout(() => {
        setIsOpen(false);
        setSuccessText("");
      }, 1000);
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.CREATE, `users/${firebaseUser.uid}`);
      } catch (logErr: any) {
        console.error("Profile set failure logged:", logErr);
        setErrorText(language === "th" ? "ไม่สามารถบันทึกประวัติร่วมกับคลาวด์ Firebase ได้ โปรลองล็อกอินใหม่อีกครั้ง" : "Could not sync your profile to Firebase. Please try authenticating again.");
      }
    } finally {
      setIsLinking(false);
    }
  };

  const handleAuthAction = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText("");
    setSuccessText("");

    if (!username.trim() || username.length < 3) {
      setErrorText(t("auth_err_handle_len"));
      return;
    }
    if (username.toLowerCase() !== username.replace(/[^a-z0-9_]/g, "")) {
      setErrorText(t("auth_err_handle_chars"));
      return;
    }
    if (password.length < 4) {
      setErrorText(t("auth_err_pin_len"));
      return;
    }

    const cleanUsername = username.trim().toLowerCase();

    if (authMode === "login") {
      const found = registeredUsers[cleanUsername];
      if (found && found.passwordHash === password) {
        onLogin(found.userObj);
        setSuccessText(t("auth_welcome", [found.userObj.username]));
        localStorage.setItem("roblox_archives_current_user", JSON.stringify(found.userObj));
        setTimeout(() => {
          setIsOpen(false);
          setSuccessText("");
        }, 1000);
      } else {
        setErrorText(t("auth_err_invalid"));
      }
    } else {
      if (registeredUsers[cleanUsername]) {
        setErrorText(t("auth_err_dup"));
        return;
      }

      const avatar = PRESET_AVATARS.find((a) => a.type === selectedAvatar) || PRESET_AVATARS[0];
      const newUser: RobloxUser = {
        username: username.trim(),
        avatarType: avatar.type,
        avatarColor: avatar.color,
        joinedDate: language === "th" ? "มิ.ย. 2026" : "Jun 2026",
        simulatedRobux: 1337,
      };

      const updated = {
        ...registeredUsers,
        [cleanUsername]: {
          passwordHash: password,
          userObj: newUser,
        },
      };

      localStorage.setItem("roblox_archives_users", JSON.stringify(updated));
      localStorage.setItem("roblox_archives_current_user", JSON.stringify(newUser));
      setRegisteredUsers(updated);
      onLogin(newUser);

      setSuccessText(t("auth_deployed_success"));
      setTimeout(() => {
        setIsOpen(false);
        setSuccessText("");
      }, 1000);
    }
  };

  const deleteAccount = (uName: string) => {
    if (uName === "builderman" || uName === "classic_guest") {
      setErrorText(t("auth_delete_success"));
      setTimeout(() => setErrorText(""), 4500);
      return;
    }
    const cleanU = uName.toLowerCase();
    const copy = { ...registeredUsers };
    delete copy[cleanU];
    localStorage.setItem("roblox_archives_users", JSON.stringify(copy));
    setRegisteredUsers(copy);

    if (currentUser?.username.toLowerCase() === cleanU) {
      handleLogout();
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("roblox_archives_current_user");
      onLogout();
      setErrorText("");
      setSuccessText("");
    } catch (e) {
      console.error("Failed to sign out of Google/Firebase:", e);
    }
  };

  const selectQuickProfile = (userObj: RobloxUser) => {
    onLogin(userObj);
    localStorage.setItem("roblox_archives_current_user", JSON.stringify(userObj));
    setSuccessText(t("auth_logged_in_as", [userObj.username]));
    setTimeout(() => {
      setIsOpen(false);
      setSuccessText("");
    }, 800);
  };

  return (
    <div id="roblox-google-auth-container" className="flex items-center gap-2">
      {currentUser ? (
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 rounded-xl px-3 py-1.5 transition-all text-left group cursor-pointer"
          >
            <div className={`w-7 h-7 rounded-lg bg-gradient-to-br flex items-center justify-center font-display font-black text-xs text-white shrink-0 shadow-inner overflow-hidden ${currentUser.avatarColor || "from-red-650 to-neutral-900"}`}>
              {currentUser.avatarUrl ? (
                <img src={currentUser.avatarUrl} alt={currentUser.username || "Avatar"} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : currentUser.username ? (
                currentUser.username[0].toUpperCase()
              ) : (
                "U"
              )}
            </div>
            <div>
              <div className="text-[9px] font-mono text-neutral-400 group-hover:text-red-500 transition-colors leading-none uppercase font-semibold">
                {currentUser.uid ? t("auth_verified") : t("auth_local")}
              </div>
              <div className="text-xs font-semibold text-white truncate max-w-[90px] md:max-w-[124px] mt-0.5">
                {currentUser.username}
              </div>
              <div className="sm:hidden text-[9px] font-mono text-yellow-500 font-bold leading-none mt-0.5">
                R$ {(currentUser.simulatedRobux ?? 0).toLocaleString()}
              </div>
            </div>
            
            {/* Display Active Robux Balance on desktop */}
            <div className="hidden sm:flex flex-col items-end pl-2.5 border-l border-neutral-800 font-mono text-right text-yellow-500 shrink-0 select-none">
              <span className="text-[8px] text-neutral-500 font-extrabold uppercase leading-none">ROBUX</span>
              <span className="text-xs font-black mt-0.5">R$ {(currentUser.simulatedRobux ?? 0).toLocaleString()}</span>
            </div>
          </button>

          <button
            onClick={handleLogout}
            title={t("auth_logout_tooltip")}
            className="p-2.5 bg-neutral-950 hover:bg-red-950/40 text-neutral-500 hover:text-red-500 border border-neutral-900 hover:border-red-900/30 rounded-xl transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setAuthMode("login");
              setIsOpen(true);
            }}
            className="font-mono text-[10px] text-white hover:text-red-500 bg-neutral-900/60 border border-neutral-850 hover:border-red-650 px-3 py-1.5 rounded-lg transition-all uppercase tracking-wide cursor-pointer font-bold"
          >
            {t("auth_signin")}
          </button>
          <button
            onClick={() => {
              setAuthMode("signup");
              setIsOpen(true);
            }}
            className="font-mono text-[10px] text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg transition-all uppercase tracking-wide font-black cursor-pointer shadow-md"
          >
            {t("auth_signup")}
          </button>
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div
            className="card-gradient rounded-2xl max-w-xl w-full p-6 md:p-8 relative shadow-3xl text-left overflow-hidden max-h-[90vh] overflow-y-auto border border-neutral-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-red-650"></div>

            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white text-lg font-mono cursor-pointer bg-transparent border-0 outline-none p-1"
            >
              &times;
            </button>

            {/* If Google Authenticated but missing custom profile settings */}
            {needsProfileSetup ? (
              <div>
                <div className="mb-6">
                  <span className="text-[10px] font-mono text-red-500 font-black uppercase tracking-widest block mb-1">
                    {t("auth_cloud_sync")}
                  </span>
                  <h3 className="font-display font-black text-xl md:text-2xl uppercase tracking-tight text-white">
                    {t("auth_assemble_persona")}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed font-sans">
                    {t("auth_verified_google", [firebaseUser?.email])}
                  </p>
                </div>

                <form onSubmit={handleCompleteSetup} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block mb-1 font-bold">
                      {t("auth_choose_handle")}
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 w-4 h-4 text-neutral-500" />
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="e.g. BuildermanCloud, Admin_Noob"
                        className="w-full bg-neutral-900 border border-neutral-800 focus:border-red-600 focus:outline-none rounded-lg py-2 pl-9 pr-4 text-xs font-semibold text-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block mb-2 font-bold">
                      {t("auth_select_avatar_rig")}
                    </label>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                      {PRESET_AVATARS.map((rig) => (
                        <button
                          type="button"
                          key={rig.type}
                          onClick={() => setSelectedAvatar(rig.type)}
                          className={`p-2.5 border rounded-lg text-left transition-all cursor-pointer ${
                            selectedAvatar === rig.type
                              ? "bg-red-950/20 border-red-600"
                              : "bg-[#0c0c0d] border-neutral-850 hover:border-neutral-750"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1.5">
                            <div className={`w-6 h-6 rounded bg-gradient-to-br flex items-center justify-center font-display font-black text-[9px] text-white shrink-0 ${rig.color}`}>
                              {rig.initials}
                            </div>
                            <span className="text-[11px] font-bold text-neutral-200">
                              {rig.type}
                            </span>
                          </div>
                          <span className="text-[9px] font-mono text-neutral-520 block leading-tight text-neutral-500 font-sans">
                            {rig.desc}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {errorText && (
                    <div className="p-3 bg-red-950/30 border border-red-900/40 text-red-100 font-mono text-[10px] rounded-lg">
                      ❌ {errorText}
                    </div>
                  )}
                  {successText && (
                    <div className="p-3 bg-green-950/30 border border-green-900/40 text-green-350 font-mono text-[10px] rounded-lg animate-pulse font-semibold">
                      ✓ {successText}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLinking}
                    className="w-full py-2.5 bg-red-600 hover:bg-red-750 disabled:opacity-50 text-white font-mono text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer font-extrabold"
                  >
                    {isLinking ? (language === "th" ? "กำลังประมวลผลเซสชัน..." : "SYNCHRONIZING...") : t("auth_link_btn")}
                  </button>
                </form>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <span className="text-[10px] font-mono text-red-500 font-black uppercase tracking-widest block mb-1">
                    {t("auth_cloud_sync")}
                  </span>
                  <h3 className="font-display font-black text-xl md:text-2xl uppercase tracking-tight text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-red-500 shrink-0" />
                    {authMode === "login" ? t("auth_auth_authority") : t("auth_registrar")}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed font-sans">
                    {t("auth_desc_main")}
                  </p>
                </div>

                {/* REAL GOOGLE AUTH POPUP TRIGGER BUTTON */}
                <div className="mb-6">
                  <button
                    onClick={handleGoogleSignIn}
                    className="w-full flex items-center justify-center gap-3 bg-white text-black font-sans font-extrabold text-xs tracking-wider py-3 px-4 rounded-xl border border-neutral-300 hover:bg-neutral-100 transition-all shadow-md cursor-pointer"
                  >
                    {/* Google Icon Minimal Vector rendering */}
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                    </svg>
                    {t("auth_continue_google")}
                  </button>

                  <div className="relative text-center my-4">
                    <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest bg-zinc-950 px-3 z-10 relative">
                      {t("auth_or_use_legacy")}
                    </span>
                    <hr className="border-neutral-900 absolute top-1/2 left-0 right-0 -z-0" />
                  </div>
                </div>

                {authMode === "login" && (
                  <div className="mb-6 bg-neutral-950 p-4 rounded-xl border border-neutral-900">
                    <span className="text-[10px] font-mono text-neutral-500 block uppercase tracking-wider mb-1 font-bold">
                      {t("auth_local_profiles_hdr")}
                    </span>
                    <p className="text-[10px] text-neutral-400 mb-3 leading-relaxed">
                      {language === "th"
                        ? "นี่คือโหนดบัญชีระบบจำลองประวัติศาสตร์ (Builderman เป็นผู้ดูแลระบบเริ่มด้วยเงินก้อนโต ส่วน ClassicGuest มีงบพอดีคำ) คุณสามารถปรับใช้และสมัครบัญชีแยกเฉพาะใหม่ของคุณเองได้ที่ปุ่มสีแดงด้านล่าง"
                        : "These are built-in historical demo profiles (Builderman starts with rich funds, ClassicGuest starts with a clean slate). You can register your own custom account by clicking 'CREATE ACCOUNT' below."}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {(Object.values(registeredUsers) as Array<{ passwordHash: string; userObj: RobloxUser }>).map((u) => (
                        <div
                          key={u.userObj.username}
                          className="flex items-center justify-between bg-neutral-900 border border-neutral-850 hover:border-red-500/40 p-2 rounded-lg cursor-pointer transition-all"
                          onClick={() => selectQuickProfile(u.userObj)}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded bg-gradient-to-br flex items-center justify-center text-white text-[10px] font-black shrink-0 ${u.userObj.avatarColor}`}>
                              {u.userObj.username[0].toUpperCase()}
                            </div>
                            <div>
                              <div className="text-[11px] font-semibold text-neutral-200">
                                {u.userObj.username}
                              </div>
                              <div className="text-[8px] font-mono text-neutral-500 uppercase flex flex-wrap items-center gap-1">
                                <span>{u.userObj.avatarType}</span>
                                <span className="text-yellow-500 font-bold">&bull; R$ {(u.userObj.simulatedRobux ?? 0).toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                            {currentUser?.username === u.userObj.username ? (
                              <div className="w-5 h-5 bg-green-950 text-green-400 rounded flex items-center justify-center text-[10px]">
                                <Check className="w-3 h-3 text-green-400" />
                              </div>
                            ) : (
                              <button
                                onClick={() => selectQuickProfile(u.userObj)}
                                className="text-[9px] font-mono bg-neutral-800 hover:bg-neutral-750 px-2 py-0.5 rounded text-neutral-300 cursor-pointer font-bold border-0"
                              >
                                {language === "th" ? "เลือกใช้" : "SELECT"}
                              </button>
                            )}
                            {u.userObj.username.toLowerCase() !== "builderman" && u.userObj.username.toLowerCase() !== "classicguest" && (
                              <button
                                onClick={() => deleteAccount(u.userObj.username)}
                                className="p-1 hover:bg-red-950/50 rounded text-neutral-500 hover:text-red-500 transition-colors border-0 cursor-pointer"
                                title="Delete User"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <form onSubmit={handleAuthAction} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block mb-1 font-bold">
                      {t("auth_local_un")}
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 w-4 h-4 text-neutral-500" />
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="e.g. builderman, RetroFan_06"
                        className="w-full bg-neutral-900 border border-neutral-800 focus:border-red-600 focus:outline-none rounded-lg py-2 pl-9 pr-4 text-xs font-semibold text-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block mb-1 font-bold">
                      {t("auth_pin")}
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 w-4 h-4 text-neutral-500" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••"
                        className="w-full bg-neutral-900 border border-neutral-800 focus:border-red-600 focus:outline-none rounded-lg py-2 pl-9 pr-4 text-xs leading-none text-white tracking-widest"
                        required
                      />
                    </div>
                    {authMode === "login" && (
                      <span className="text-[9px] font-mono text-neutral-500 mt-1 block leading-normal">
                        {t("auth_hint_node")}
                      </span>
                    )}
                  </div>

                  {authMode === "signup" && (
                    <div>
                      <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block mb-2 font-bold">
                        {t("auth_select_avatar_rig")}
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {PRESET_AVATARS.map((rig) => (
                          <button
                            type="button"
                            key={rig.type}
                            onClick={() => setSelectedAvatar(rig.type)}
                            className={`p-2.5 border rounded-lg text-left transition-all cursor-pointer ${
                              selectedAvatar === rig.type
                                ? "bg-red-950/20 border-red-600"
                                : "bg-[#0c0c0d] border-neutral-850 hover:border-neutral-750"
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1.5">
                              <div className={`w-6 h-6 rounded bg-gradient-to-br flex items-center justify-center font-display font-black text-[9px] text-white shrink-0 ${rig.color}`}>
                                {rig.initials}
                              </div>
                              <span className="text-[11px] font-bold text-neutral-200">
                                {rig.type}
                              </span>
                            </div>
                            <span className="text-[9px] font-mono text-neutral-500 block leading-tight font-sans">
                              {rig.desc}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {errorText && (
                    <div className="p-3 bg-red-950/30 border border-red-900/40 text-red-300 font-mono text-[10px] rounded-lg">
                      ❌ {errorText}
                    </div>
                  )}
                  {successText && (
                    <div className="p-3 bg-green-950/30 border border-green-900/40 text-green-450 font-mono text-[10px] rounded-lg animate-pulse font-semibold">
                      ✓ {successText}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-red-650 hover:bg-red-700 text-white font-mono text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer font-bold"
                    >
                      {authMode === "login" ? t("auth_auth_entry") : t("auth_deploy")}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setErrorText("");
                        setSuccessText("");
                        setAuthMode(authMode === "login" ? "signup" : "login");
                      }}
                      className="px-4 py-2.5 bg-[#121213] hover:bg-neutral-850 border border-neutral-800 text-neutral-300 font-mono text-xs font-semibold rounded-xl transition-all cursor-pointer"
                    >
                      {authMode === "login" ? t("auth_no_account") : t("auth_has_account")}
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-neutral-900 flex justify-between items-center text-[9px] text-neutral-500 font-mono">
              <span className="flex items-center gap-1 leading-none">
                <Star className="w-3 h-3 text-yellow-500" /> {t("auth_cloud_active")}
              </span>
              <span>{t("auth_ver_layer")}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
