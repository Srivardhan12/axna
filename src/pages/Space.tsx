import { useUser } from "@/context/userContsxtProvider";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, increment } from "firebase/firestore";
import { db } from "@/config";

export default function Space() {
  const navigate = useNavigate();
  const { user, globalSpaceName } = useUser();
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user && user.uid) {
      const userRef = doc(db, "users", user.uid);
      setDoc(userRef, { spacesUsed: increment(1) }, { merge: true })
        .catch((error) => {
          console.error("Error updating spacesUsed:", error);
        });
      // user.spacesUsed += 1; // Update the local user state
    }
  }, [globalSpaceName, user]);

  return (
    <div>
      <h2>{globalSpaceName}</h2>
    </div>
  );
}
