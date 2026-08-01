import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD9wT1t_Fkc0udZywXBlHhAvya06jArMgo",
  authDomain: "mccv-a64a1.firebaseapp.com",
  projectId: "mccv-a64a1",
  storageBucket: "mccv-a64a1.firebasestorage.app",
  messagingSenderId: "815811481712",
  appId: "1:815811481712:web:58577f626039d31a81e4b5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Connexion avec le compte Arnaud7
await signInWithEmailAndPassword(auth, "arnaud7@mccv.local", "Auxerre7!");
const userId = "pzhaAekgcJUacHsbj7MOYqxGKo32";

// Fonction pour convertir les numéros de série Excel en dates
function excelDateToJS(serial) {
  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400;
  return new Date(utc_value * 1000);
}

// Année scolaire 2026-2027
const anneeScolaireId = "as_2026_2027";
await setDoc(doc(db, "users", userId, "data", "anneesScolaires"), {
  anneesScolaires: [{
    id: anneeScolaireId,
    label: "2026-2027",
    dateDebut: "2026-08-31",
    dateFin: "2027-06-30",
    active: false
  }]
}, { merge: true });

// Classes avec couleurs
const classes = [
  { id: "c_bts_compta_1a", nom: "BTS Compta Gestion 1A", couleur: "#fde68a", matieres: [
    { id: "m1", nom: "Activités liées à l'Alternance" },
    { id: "m2", nom: "E5 - Développement de la relation client et vente conseil" },
    { id: "m3", nom: "E8 - Management de l'équipe commerciale" }
  ]},
  { id: "c_bts_mco_1a", nom: "BTS MCO 1A", couleur: "#bbf7d0", matieres: [
    { id: "m1", nom: "Activités liées à l'Alternance" },
    { id: "m2", nom: "E5 - Développement de la relation client et vente conseil" },
    { id: "m3", nom: "E7 - Gestion opérationnelle" },
    { id: "m4", nom: "E8 - Management de l'équipe commerciale" }
  ]},
  { id: "c_bts_mco_2a", nom: "BTS MCO 2A", couleur: "#bfdbfe", matieres: [
    { id: "m1", nom: "E5 - Développement de la relation client et vente conseil" },
    { id: "m2", nom: "E7 - Gestion opérationnelle" },
    { id: "m3", nom: "E8 - Management de l'équipe commerciale" }
  ]},
  { id: "c_bts_ndrc_1a", nom: "BTS NDRC 1A", couleur: "#ddd6fe", matieres: [
    { id: "m1", nom: "E4 - Relation client et négociation vente" }
  ]},
  { id: "c_bts_sam_1a", nom: "BTS SAM 1A", couleur: "#fecaca", matieres: [
    { id: "m1", nom: "Activités liées à l'Alternance" },
    { id: "m2", nom: "E5 - Développement de la relation client et vente conseil" },
    { id: "m3", nom: "E8 - Management de l'équipe commerciale" }
  ]},
  { id: "c_bachelor_rem", nom: "Bachelor REM", couleur: "#fed7aa", matieres: [
    { id: "m1", nom: "BLOC 1 - Coordonner et améliorer l'activité commerciale" },
    { id: "m2", nom: "BLOC 2 - Contribuer aux orientations stratégiques" },
    { id: "m3", nom: "BLOC 3 - Manager les salariés" }
  ]}
];

// Sauvegarder les classes
await setDoc(doc(db, "users", userId, "data", "classes"), {
  classes: classes
}, { merge: true });

// Séances brutes depuis l'Excel (numéro Excel → date réelle)
const seancesRaw = [
  // BTS Compta Gestion 1A
  { classe: "c_bts_compta_1a", matiere: "Activités liées à l'Alternance", dateExcel: 46266, debut: "08:30", fin: "12:30" },
  { classe: "c_bts_compta_1a", matiere: "E5 - Développement de la relation client et vente conseil", dateExcel: 46267, debut: "08:30", fin: "12:30" },
  { classe: "c_bts_compta_1a", matiere: "E8 - Management de l'équipe commerciale", dateExcel: 46266, debut: "13:30", fin: "17:30" },
  { classe: "c_bts_compta_1a", matiere: "E8 - Management de l'équipe commerciale", dateExcel: 46267, debut: "13:30", fin: "17:30" },
  // BTS MCO 1A
  { classe: "c_bts_mco_1a", matiere: "Activités liées à l'Alternance", dateExcel: 46266, debut: "08:30", fin: "12:30" },
  { classe: "c_bts_mco_1a", matiere: "E5 - Développement de la relation client et vente conseil", dateExcel: 46267, debut: "08:30", fin: "12:30" },
  { classe: "c_bts_mco_1a", matiere: "E5 - Développement de la relation client et vente conseil", dateExcel: 46279, debut: "15:30", fin: "17:30" },
  { classe: "c_bts_mco_1a", matiere: "E5 - Développement de la relation client et vente conseil", dateExcel: 46287, debut: "15:00", fin: "17:30" },
  { classe: "c_bts_mco_1a", matiere: "E5 - Développement de la relation client et vente conseil", dateExcel: 46293, debut: "15:30", fin: "17:30" },
  { classe: "c_bts_mco_1a", matiere: "E5 - Développement de la relation client et vente conseil", dateExcel: 46308, debut: "15:00", fin: "17:30" },
  { classe: "c_bts_mco_1a", matiere: "E5 - Développement de la relation client et vente conseil", dateExcel: 46328, debut: "15:30", fin: "17:30" },
  { classe: "c_bts_mco_1a", matiere: "E5 - Développement de la relation client et vente conseil", dateExcel: 46336, debut: "15:00", fin: "17:30" },
  { classe: "c_bts_mco_1a", matiere: "E5 - Développement de la relation client et vente conseil", dateExcel: 46350, debut: "15:00", fin: "17:30" },
  { classe: "c_bts_mco_1a", matiere: "E5 - Développement de la relation client et vente conseil", dateExcel: 46364, debut: "15:00", fin: "17:30" },
  { classe: "c_bts_mco_1a", matiere: "E5 - Développement de la relation client et vente conseil", dateExcel: 46427, debut: "15:00", fin: "17:30" },
  { classe: "c_bts_mco_1a", matiere: "E5 - Développement de la relation client et vente conseil", dateExcel: 46455, debut: "15:00", fin: "17:30" },
  { classe: "c_bts_mco_1a", matiere: "E5 - Développement de la relation client et vente conseil", dateExcel: 46469, debut: "15:00", fin: "17:30" },
  { classe: "c_bts_mco_1a", matiere: "E5 - Développement de la relation client et vente conseil", dateExcel: 46483, debut: "15:00", fin: "17:30" },
  { classe: "c_bts_mco_1a", matiere: "E5 - Développement de la relation client et vente conseil", dateExcel: 46511, debut: "15:00", fin: "17:30" },
  { classe: "c_bts_mco_1a", matiere: "E5 - Développement de la relation client et vente conseil", dateExcel: 46525, debut: "15:00", fin: "17:30" },
  { classe: "c_bts_mco_1a", matiere: "E5 - Développement de la relation client et vente conseil", dateExcel: 46539, debut: "15:00", fin: "17:30" },
  { classe: "c_bts_mco_1a", matiere: "E5 - Développement de la relation client et vente conseil", dateExcel: 46553, debut: "15:00", fin: "17:30" },
  { classe: "c_bts_mco_1a", matiere: "E5 - Développement de la relation client et vente conseil", dateExcel: 46567, debut: "15:00", fin: "17:30" },
  { classe: "c_bts_mco_1a", matiere: "E7 - Gestion opérationnelle", dateExcel: 46280, debut: "11:00", fin: "12:30" },
  { classe: "c_bts_mco_1a", matiere: "E7 - Gestion opérationnelle", dateExcel: 46280, debut: "13:30", fin: "15:00" },
  { classe: "c_bts_mco_1a", matiere: "E7 - Gestion opérationnelle", dateExcel: 46287, debut: "11:00", fin: "12:30" },
  { classe: "c_bts_mco_1a", matiere: "E7 - Gestion opérationnelle", dateExcel: 46287, debut: "13:30", fin: "15:00" },
  { classe: "c_bts_mco_1a", matiere: "E7 - Gestion opérationnelle", dateExcel: 46301, debut: "13:30", fin: "15:30" },
  { classe: "c_bts_mco_1a", matiere: "E7 - Gestion opérationnelle", dateExcel: 46308, debut: "11:00", fin: "12:30" },
  { classe: "c_bts_mco_1a", matiere: "E7 - Gestion opérationnelle", dateExcel: 46308, debut: "13:30", fin: "15:00" },
  { classe: "c_bts_mco_1a", matiere: "E7 - Gestion opérationnelle", dateExcel: 46315, debut: "13:30", fin: "15:30" },
  { classe: "c_bts_mco_1a", matiere: "E7 - Gestion opérationnelle", dateExcel: 46329, debut: "13:30", fin: "15:30" },
  { classe: "c_bts_mco_1a", matiere: "E7 - Gestion opérationnelle", dateExcel: 46336, debut: "11:00", fin: "12:30" },
  { classe: "c_bts_mco_1a", matiere: "E7 - Gestion opérationnelle", dateExcel: 46336, debut: "13:30", fin: "15:00" },
  { classe: "c_bts_mco_1a", matiere: "E7 - Gestion opérationnelle", dateExcel: 46343, debut: "13:30", fin: "15:30" },
  { classe: "c_bts_mco_1a", matiere: "E7 - Gestion opérationnelle", dateExcel: 46350, debut: "11:00", fin: "12:30" },
  { classe: "c_bts_mco_1a", matiere: "E7 - Gestion opérationnelle", dateExcel: 46350, debut: "13:30", fin: "15:00" },
  { classe: "c_bts_mco_1a", matiere: "E7 - Gestion opérationnelle", dateExcel: 46357, debut: "13:30", fin: "15:30" },
  { classe: "c_bts_mco_1a", matiere: "E7 - Gestion opérationnelle", dateExcel: 46364, debut: "11:00", fin: "12:30" },
  { classe: "c_bts_mco_1a", matiere: "E7 - Gestion opérationnelle", dateExcel: 46364, debut: "13:30", fin: "15:00" },
  { classe: "c_bts_mco_1a", matiere: "E7 - Gestion opérationnelle", dateExcel: 46371, debut: "13:30", fin: "15:30" },
  { classe: "c_bts_mco_1a", matiere: "E7 - Gestion opérationnelle", dateExcel: 46420, debut: "13:30", fin: "15:30" },
  { classe: "c_bts_mco_1a", matiere: "E7 - Gestion opérationnelle", dateExcel: 46427, debut: "11:00", fin: "12:30" },
  { classe: "c_bts_mco_1a", matiere: "E7 - Gestion opérationnelle", dateExcel: 46427, debut: "13:30", fin: "15:00" },
  { classe: "c_bts_mco_1a", matiere: "E7 - Gestion opérationnelle", dateExcel: 46434, debut: "13:30", fin: "15:30" },
  { classe: "c_bts_mco_1a", matiere: "E7 - Gestion opérationnelle", dateExcel: 46448, debut: "13:30", fin: "15:30" },
  { classe: "c_bts_mco_1a", matiere: "E7 - Gestion opérationnelle", dateExcel: 46455, debut: "11:00", fin: "12:30" },
  { classe: "c_bts_mco_1a", matiere: "E7 - Gestion opérationnelle", dateExcel: 46455, debut: "13:30", fin: "15:00" },
  { classe: "c_bts_mco_1a", matiere: "E7 - Gestion opérationnelle", dateExcel: 46462, debut: "13:30", fin: "15:30" },
  { classe: "c_bts_mco_1a", matiere: "E7 - Gestion opérationnelle", dateExcel: 46469, debut: "11:00", fin: "12:30" },
  { classe: "c_bts_mco_1a", matiere: "E7 - Gestion opérationnelle", dateExcel: 46469, debut: "13:30", fin: "15:00" },
  { classe: "c_bts_mco_1a", matiere: "E7 - Gestion opérationnelle", dateExcel: 46483, debut: "11:00", fin: "12:30" },
  { classe: "c_bts_mco_1a", matiere: "E7 - Gestion opérationnelle", dateExcel: 46483, debut: "13:30", fin: "15:00" },
  { classe: "c_bts_mco_1a", matiere: "E7 - Gestion opérationnelle", dateExcel: 46490, debut: "13:30", fin: "15:30" },
  { classe: "c_bts_mco_1a", matiere: "E7 - Gestion opérationnelle", dateExcel: 46504, debut: "13:30", fin: "15:30" },
  { classe: "c_bts_mco_1a", matiere: "E7 - Gestion opérationnelle", dateExcel: 46511, debut: "11:00", fin: "12:30" },
  { classe: "c_bts_mco_1a", matiere: "E7 - Gestion opérationnelle", dateExcel: 46511, debut: "13:30", fin: "15:00" },
  { classe: "c_bts_mco_1a", matiere: "E7 - Gestion opérationnelle", dateExcel: 46518, debut: "13:30", fin: "15:30" },
  { classe: "c_bts_mco_1a", matiere: "E7 - Gestion opérationnelle", dateExcel: 46525, debut: "13:30", fin: "15:00" },
  { classe: "c_bts_mco_1a", matiere: "E7 - Gestion opérationnelle", dateExcel: 46532, debut: "13:30", fin: "15:30" },
  { classe: "c_bts_mco_1a", matiere: "E7 - Gestion opérationnelle", dateExcel: 46539, debut: "11:00", fin: "12:30" },
  { classe: "c_bts_mco_1a", matiere: "E7 - Gestion opérationnelle", dateExcel: 46539, debut: "13:30", fin: "15:00" },
  { classe: "c_bts_mco_1a", matiere: "E7 - Gestion opérationnelle", dateExcel: 46546, debut: "13:30", fin: "15:30" },
  { classe: "c_bts_mco_1a", matiere: "E7 - Gestion opérationnelle", dateExcel: 46553, debut: "11:00", fin: "12:30" },
  { classe: "c_bts_mco_1a", matiere: "E7 - Gestion opérationnelle", dateExcel: 46553, debut: "13:30", fin: "15:00" },
  { classe: "c_bts_mco_1a", matiere: "E7 - Gestion opérationnelle", dateExcel: 46560, debut: "13:30", fin: "15:30" },
  { classe: "c_bts_mco_1a", matiere: "E7 - Gestion opérationnelle", dateExcel: 46567, debut: "11:00", fin: "12:30" },
  { classe: "c_bts_mco_1a", matiere: "E7 - Gestion opérationnelle", dateExcel: 46567, debut: "13:30", fin: "15:00" },
  { classe: "c_bts_mco_1a", matiere: "E8 - Management de l'équipe commerciale", dateExcel: 46266, debut: "13:30", fin: "17:30" },
  { classe: "c_bts_mco_1a", matiere: "E8 - Management de l'équipe commerciale", dateExcel: 46267, debut: "13:30", fin: "17:30" },
  { classe: "c_bts_mco_1a", matiere: "E8 - Management de l'équipe commerciale", dateExcel: 46280, debut: "15:00", fin: "17:30" },
  { classe: "c_bts_mco_1a", matiere: "E8 - Management de l'équipe commerciale", dateExcel: 46294, debut: "15:00", fin: "17:30" },
  { classe: "c_bts_mco_1a", matiere: "E8 - Management de l'équipe commerciale", dateExcel: 46335, debut: "15:30", fin: "17:30" },
  { classe: "c_bts_mco_1a", matiere: "E8 - Management de l'équipe commerciale", dateExcel: 46342, debut: "15:30", fin: "17:30" },
  { classe: "c_bts_mco_1a", matiere: "E8 - Management de l'équipe commerciale", dateExcel: 46349, debut: "15:30", fin: "17:30" },
  { classe: "c_bts_mco_1a", matiere: "E8 - Management de l'équipe commerciale", dateExcel: 46363, debut: "15:30", fin: "17:30" },
  { classe: "c_bts_mco_1a", matiere: "E8 - Management de l'équipe commerciale", dateExcel: 46370, debut: "15:30", fin: "17:30" },
  { classe: "c_bts_mco_1a", matiere: "E8 - Management de l'équipe commerciale", dateExcel: 46419, debut: "15:30", fin: "17:30" },
  { classe: "c_bts_mco_1a", matiere: "E8 - Management de l'équipe commerciale", dateExcel: 46426, debut: "15:30", fin: "17:30" },
  { classe: "c_bts_mco_1a", matiere: "E8 - Management de l'équipe commerciale", dateExcel: 46433, debut: "15:30", fin: "17:30" },
  { classe: "c_bts_mco_1a", matiere: "E8 - Management de l'équipe commerciale", dateExcel: 46447, debut: "15:30", fin: "17:30" },
  { classe: "c_bts_mco_1a", matiere: "E8 - Management de l'équipe commerciale", dateExcel: 46454, debut: "15:30", fin: "17:30" },
  { classe: "c_bts_mco_1a", matiere: "E8 - Management de l'équipe commerciale", dateExcel: 46461, debut: "15:30", fin: "17:30" },
  { classe: "c_bts_mco_1a", matiere: "E8 - Management de l'équipe commerciale", dateExcel: 46468, debut: "15:30", fin: "17:30" },
  { classe: "c_bts_mco_1a", matiere: "E8 - Management de l'équipe commerciale", dateExcel: 46482, debut: "15:30", fin: "17:30" },
  { classe: "c_bts_mco_1a", matiere: "E8 - Management de l'équipe commerciale", dateExcel: 46489, debut: "15:30", fin: "17:30" },
  { classe: "c_bts_mco_1a", matiere: "E8 - Management de l'équipe commerciale", dateExcel: 46503, debut: "15:30", fin: "17:30" },
  { classe: "c_bts_mco_1a", matiere: "E8 - Management de l'équipe commerciale", dateExcel: 46510, debut: "15:30", fin: "17:30" },
  { classe: "c_bts_mco_1a", matiere: "E8 - Management de l'équipe commerciale", dateExcel: 46517, debut: "15:30", fin: "17:30" },
  { classe: "c_bts_mco_1a", matiere: "E8 - Management de l'équipe commerciale", dateExcel: 46531, debut: "15:30", fin: "17:30" },
  { classe: "c_bts_mco_1a", matiere: "E8 - Management de l'équipe commerciale", dateExcel: 46538, debut: "15:30", fin: "17:30" },
  { classe: "c_bts_mco_1a", matiere: "E8 - Management de l'équipe commerciale", dateExcel: 46545, debut: "15:30", fin: "17:30" },
  { classe: "c_bts_mco_1a", matiere: "E8 - Management de l'équipe commerciale", dateExcel: 46552, debut: "15:30", fin: "17:30" },
  { classe: "c_bts_mco_1a", matiere: "E8 - Management de l'équipe commerciale", dateExcel: 46559, debut: "15:30", fin: "17:30" },
  { classe: "c_bts_mco_1a", matiere: "E8 - Management de l'équipe commerciale", dateExcel: 46566, debut: "15:30", fin: "17:30" },
  // BTS MCO 2A
  { classe: "c_bts_mco_2a", matiere: "E5 - Développement de la relation client et vente conseil", dateExcel: 46265, debut: "08:30", fin: "12:30" },
  { classe: "c_bts_mco_2a", matiere: "E5 - Développement de la relation client et vente conseil", dateExcel: 46265, debut: "13:30", fin: "17:30" },
  { classe: "c_bts_mco_2a", matiere: "E5 - Développement de la relation client et vente conseil", dateExcel: 46279, debut: "15:30", fin: "17:30" },
  { classe: "c_bts_mco_2a", matiere: "E5 - Développement de la relation client et vente conseil", dateExcel: 46287, debut: "15:00", fin: "17:30" },
  { classe: "c_bts_mco_2a", matiere: "E5 - Développement de la relation client et vente conseil", dateExcel: 46293, debut: "15:30", fin: "17:30" },
  { classe: "c_bts_mco_2a", matiere: "E5 - Développement de la relation client et vente conseil", dateExcel: 46295, debut: "13:30", fin: "17:30" },
  { classe: "c_bts_mco_2a", matiere: "E5 - Développement de la relation client et vente conseil", dateExcel: 46308, debut: "15:00", fin: "17:30" },
  { classe: "c_bts_mco_2a", matiere: "E5 - Développement de la relation client et vente conseil", dateExcel: 46328, debut: "15:30", fin: "17:30" },
  { classe: "c_bts_mco_2a", matiere: "E5 - Développement de la relation client et vente conseil", dateExcel: 46336, debut: "15:00", fin: "17:30" },
  { classe: "c_bts_mco_2a", matiere: "E5 - Développement de la relation client et vente conseil", dateExcel: 46350, debut: "15:00", fin: "17:30" },
  { classe: "c_bts_mco_2a", matiere: "E5 - Développement de la relation client et vente conseil", dateExcel: 46364, debut: "15:00", fin: "17:30" },
  { classe: "c_bts_mco_2a", matiere: "E5 - Développement de la relation client et vente conseil", dateExcel: 46427, debut: "15:00", fin: "17:30" },
  { classe: "c_bts_mco_2a", matiere: "E5 - Développement de la relation client et vente conseil", dateExcel: 46455, debut: "15:00", fin: "17:30" },
  { classe: "c_bts_mco_2a", matiere: "E5 - Développement de la relation client et vente conseil", dateExcel: 46469, debut: "15:00", fin: "17:30" },
  { classe: "c_bts_mco_2a", matiere: "E5 - Développement de la relation client et vente conseil", dateExcel: 46483, debut: "15:00", fin: "17:30" },
  { classe: "c_bts_mco_2a", matiere: "E5 - Développement de la relation client et vente conseil", dateExcel: 46511, debut: "15:00", fin: "17:30" },
  { classe: "c_bts_mco_2a", matiere: "E5 - Développement de la relation client et vente conseil", dateExcel: 46525, debut: "15:00", fin: "17:30" },
  { classe: "c_bts_mco_2a", matiere: "E5 - Développement de la relation client et vente conseil", dateExcel: 46539, debut: "15:00", fin: "17:30" },
  { classe: "c_bts_mco_2a", matiere: "E5 - Développement de la relation client et vente conseil", dateExcel: 46553, debut: "15:00", fin: "17:30" },
  { classe: "c_bts_mco_2a", matiere: "E5 - Développement de la relation client et vente conseil", dateExcel: 46567, debut: "15:00", fin: "17:30" },
  { classe: "c_bts_mco_2a", matiere: "E7 - Gestion opérationnelle", dateExcel: 46280, debut: "11:00", fin: "12:30" },
  { classe: "c_bts_mco_2a", matiere: "E7 - Gestion opérationnelle", dateExcel: 46280, debut: "13:30", fin: "15:00" },
  { classe: "c_bts_mco_2a", matiere: "E7 - Gestion opérationnelle", dateExcel: 46287, debut: "11:00", fin: "12:30" },
  { classe: "c_bts_mco_2a", matiere: "E7 - Gestion opérationnelle", dateExcel: 46287, debut: "13:30", fin: "15:00" },
  { classe: "c_bts_mco_2a", matiere: "E7 - Gestion opérationnelle", dateExcel: 46294, debut: "11:00", fin: "12:30" },
  { classe: "c_bts_mco_2a", matiere: "E7 - Gestion opérationnelle", dateExcel: 46294, debut: "13:30", fin: "15:00" },
  { classe: "c_bts_mco_2a", matiere: "E7 - Gestion opérationnelle", dateExcel: 46308, debut: "11:00", fin: "12:30" },
  { classe: "c_bts_mco_2a", matiere: "E7 - Gestion opérationnelle", dateExcel: 46308, debut: "13:30", fin: "15:00" },
  { classe: "c_bts_mco_2a", matiere: "E7 - Gestion opérationnelle", dateExcel: 46336, debut: "11:00", fin: "12:30" },
  { classe: "c_bts_mco_2a", matiere: "E7 - Gestion opérationnelle", dateExcel: 46336, debut: "13:30", fin: "15:00" },
  { classe: "c_bts_mco_2a", matiere: "E7 - Gestion opérationnelle", dateExcel: 46350, debut: "11:00", fin: "12:30" },
  { classe: "c_bts_mco_2a", matiere: "E7 - Gestion opérationnelle", dateExcel: 46350, debut: "13:30", fin: "15:00" },
  { classe: "c_bts_mco_2a", matiere: "E7 - Gestion opérationnelle", dateExcel: 46364, debut: "11:00", fin: "12:30" },
  { classe: "c_bts_mco_2a", matiere: "E7 - Gestion opérationnelle", dateExcel: 46364, debut: "13:30", fin: "15:00" },
  { classe: "c_bts_mco_2a", matiere: "E7 - Gestion opérationnelle", dateExcel: 46427, debut: "11:00", fin: "12:30" },
  { classe: "c_bts_mco_2a", matiere: "E7 - Gestion opérationnelle", dateExcel: 46427, debut: "13:30", fin: "15:00" },
  { classe: "c_bts_mco_2a", matiere: "E7 - Gestion opérationnelle", dateExcel: 46455, debut: "11:00", fin: "12:30" },
  { classe: "c_bts_mco_2a", matiere: "E7 - Gestion opérationnelle", dateExcel: 46455, debut: "13:30", fin: "15:00" },
  { classe: "c_bts_mco_2a", matiere: "E7 - Gestion opérationnelle", dateExcel: 46469, debut: "11:00", fin: "12:30" },
  { classe: "c_bts_mco_2a", matiere: "E7 - Gestion opérationnelle", dateExcel: 46469, debut: "13:30", fin: "15:00" },
  { classe: "c_bts_mco_2a", matiere: "E7 - Gestion opérationnelle", dateExcel: 46483, debut: "11:00", fin: "12:30" },
  { classe: "c_bts_mco_2a", matiere: "E7 - Gestion opérationnelle", dateExcel: 46483, debut: "13:30", fin: "15:00" },
  { classe: "c_bts_mco_2a", matiere: "E7 - Gestion opérationnelle", dateExcel: 46511, debut: "11:00", fin: "12:30" },
  { classe: "c_bts_mco_2a", matiere: "E7 - Gestion opérationnelle", dateExcel: 46511, debut: "13:30", fin: "15:00" },
  { classe: "c_bts_mco_2a", matiere: "E7 - Gestion opérationnelle", dateExcel: 46525, debut: "13:30", fin: "15:00" },
  { classe: "c_bts_mco_2a", matiere: "E7 - Gestion opérationnelle", dateExcel: 46539, debut: "11:00", fin: "12:30" },
  { classe: "c_bts_mco_2a", matiere: "E7 - Gestion opérationnelle", dateExcel: 46539, debut: "13:30", fin: "15:00" },
  { classe: "c_bts_mco_2a", matiere: "E7 - Gestion opérationnelle", dateExcel: 46553, debut: "11:00", fin: "12:30" },
  { classe: "c_bts_mco_2a", matiere: "E7 - Gestion opérationnelle", dateExcel: 46553, debut: "13:30", fin: "15:00" },
  { classe: "c_bts_mco_2a", matiere: "E7 - Gestion opérationnelle", dateExcel: 46567, debut: "11:00", fin: "12:30" },
  { classe: "c_bts_mco_2a", matiere: "E7 - Gestion opérationnelle", dateExcel: 46567, debut: "13:30", fin: "15:00" },
  { classe: "c_bts_mco_2a", matiere: "E8 - Management de l'équipe commerciale", dateExcel: 46266, debut: "13:30", fin: "17:30" },
  { classe: "c_bts_mco_2a", matiere: "E8 - Management de l'équipe commerciale", dateExcel: 46280, debut: "15:00", fin: "17:30" },
  { classe: "c_bts_mco_2a", matiere: "E8 - Management de l'équipe commerciale", dateExcel: 46294, debut: "15:00", fin: "17:30" },
  { classe: "c_bts_mco_2a", matiere: "E8 - Management de l'équipe commerciale", dateExcel: 46335, debut: "15:30", fin: "17:30" },
  { classe: "c_bts_mco_2a", matiere: "E8 - Management de l'équipe commerciale", dateExcel: 46342, debut: "15:30", fin: "17:30" },
  { classe: "c_bts_mco_2a", matiere: "E8 - Management de l'équipe commerciale", dateExcel: 46349, debut: "15:30", fin: "17:30" },
  { classe: "c_bts_mco_2a", matiere: "E8 - Management de l'équipe commerciale", dateExcel: 46363, debut: "15:30", fin: "17:30" },
  { classe: "c_bts_mco_2a", matiere: "E8 - Management de l'équipe commerciale", dateExcel: 46370, debut: "15:30", fin: "17:30" },
  { classe: "c_bts_mco_2a", matiere: "E8 - Management de l'équipe commerciale", dateExcel: 46419, debut: "15:30", fin: "17:30" },
  { classe: "c_bts_mco_2a", matiere: "E8 - Management de l'équipe commerciale", dateExcel: 46426, debut: "15:30", fin: "17:30" },
  { classe: "c_bts_mco_2a", matiere: "E8 - Management de l'équipe commerciale", dateExcel: 46433, debut: "15:30", fin: "17:30" },
  { classe: "c_bts_mco_2a", matiere: "E8 - Management de l'équipe commerciale", dateExcel: 46447, debut: "15:30", fin: "17:30" },
  { classe: "c_bts_mco_2a", matiere: "E8 - Management de l'équipe commerciale", dateExcel: 46454, debut: "15:30", fin: "17:30" },
  { classe: "c_bts_mco_2a", matiere: "E8 - Management de l'équipe commerciale", dateExcel: 46461, debut: "15:30", fin: "17:30" },
  { classe: "c_bts_mco_2a", matiere: "E8 - Management de l'équipe commerciale", dateExcel: 46468, debut: "15:30", fin: "17:30" },
  { classe: "c_bts_mco_2a", matiere: "E8 - Management de l'équipe commerciale", dateExcel: 46482, debut: "15:30", fin: "17:30" },
  { classe: "c_bts_mco_2a", matiere: "E8 - Management de l'équipe commerciale", dateExcel: 46489, debut: "15:30", fin: "17:30" },
  { classe: "c_bts_mco_2a", matiere: "E8 - Management de l'équipe commerciale", dateExcel: 46503, debut: "15:30", fin: "17:30" },
  { classe: "c_bts_mco_2a", matiere: "E8 - Management de l'équipe commerciale", dateExcel: 46510, debut: "15:30", fin: "17:30" },
  { classe: "c_bts_mco_2a", matiere: "E8 - Management de l'équipe commerciale", dateExcel: 46517, debut: "15:30", fin: "17:30" },
  { classe: "c_bts_mco_2a", matiere: "E8 - Management de l'équipe commerciale", dateExcel: 46531, debut: "15:30", fin: "17:30" },
  { classe: "c_bts_mco_2a", matiere: "E8 - Management de l'équipe commerciale", dateExcel: 46538, debut: "15:30", fin: "17:30" },
  { classe: "c_bts_mco_2a", matiere: "E8 - Management de l'équipe commerciale", dateExcel: 46545, debut: "15:30", fin: "17:30" },
  { classe: "c_bts_mco_2a", matiere: "E8 - Management de l'équipe commerciale", dateExcel: 46552, debut: "15:30", fin: "17:30" },
  { classe: "c_bts_mco_2a", matiere: "E8 - Management de l'équipe commerciale", dateExcel: 46559, debut: "15:30", fin: "17:30" },
  { classe: "c_bts_mco_2a", matiere: "E8 - Management de l'équipe commerciale", dateExcel: 46566, debut: "15:30", fin: "17:30" },
  // BTS NDRC 1A
  { classe: "c_bts_ndrc_1a", matiere: "E4 - Relation client et négociation vente", dateExcel: 46301, debut: "08:30", fin: "10:30" },
  { classe: "c_bts_ndrc_1a", matiere: "E4 - Relation client et négociation vente", dateExcel: 46315, debut: "08:30", fin: "10:30" },
  { classe: "c_bts_ndrc_1a", matiere: "E4 - Relation client et négociation vente", dateExcel: 46329, debut: "08:30", fin: "10:30" },
  { classe: "c_bts_ndrc_1a", matiere: "E4 - Relation client et négociation vente", dateExcel: 46343, debut: "08:30", fin: "10:30" },
  { classe: "c_bts_ndrc_1a", matiere: "E4 - Relation client et négociation vente", dateExcel: 46357, debut: "08:30", fin: "10:30" },
  { classe: "c_bts_ndrc_1a", matiere: "E4 - Relation client et négociation vente", dateExcel: 46371, debut: "08:30", fin: "10:30" },
  { classe: "c_bts_ndrc_1a", matiere: "E4 - Relation client et négociation vente", dateExcel: 46420, debut: "08:30", fin: "10:30" },
  { classe: "c_bts_ndrc_1a", matiere: "E4 - Relation client et négociation vente", dateExcel: 46434, debut: "08:30", fin: "10:30" },
  { classe: "c_bts_ndrc_1a", matiere: "E4 - Relation client et négociation vente", dateExcel: 46448, debut: "08:30", fin: "10:30" },
  { classe: "c_bts_ndrc_1a", matiere: "E4 - Relation client et négociation vente", dateExcel: 46462, debut: "08:30", fin: "10:30" },
  { classe: "c_bts_ndrc_1a", matiere: "E4 - Relation client et négociation vente", dateExcel: 46490, debut: "08:30", fin: "10:30" },
  { classe: "c_bts_ndrc_1a", matiere: "E4 - Relation client et négociation vente", dateExcel: 46504, debut: "08:30", fin: "10:30" },
  { classe: "c_bts_ndrc_1a", matiere: "E4 - Relation client et négociation vente", dateExcel: 46518, debut: "08:30", fin: "10:30" },
  { classe: "c_bts_ndrc_1a", matiere: "E4 - Relation client et négociation vente", dateExcel: 46532, debut: "08:30", fin: "10:30" },
  { classe: "c_bts_ndrc_1a", matiere: "E4 - Relation client et négociation vente", dateExcel: 46546, debut: "08:30", fin: "10:30" },
  { classe: "c_bts_ndrc_1a", matiere: "E4 - Relation client et négociation vente", dateExcel: 46560, debut: "08:30", fin: "10:30" },
  // BTS SAM 1A
  { classe: "c_bts_sam_1a", matiere: "Activités liées à l'Alternance", dateExcel: 46266, debut: "08:30", fin: "12:30" },
  { classe: "c_bts_sam_1a", matiere: "E5 - Développement de la relation client et vente conseil", dateExcel: 46267, debut: "08:30", fin: "12:30" },
  { classe: "c_bts_sam_1a", matiere: "E5 - Développement de la relation client et vente conseil", dateExcel: 46287, debut: "15:00", fin: "17:30" },
  { classe: "c_bts_sam_1a", matiere: "E5 - Développement de la relation client et vente conseil", dateExcel: 46308, debut: "15:00", fin: "17:30" },
  { classe: "c_bts_sam_1a", matiere: "E5 - Développement de la relation client et vente conseil", dateExcel: 46336, debut: "15:00", fin: "17:30" },
  { classe: "c_bts_sam_1a", matiere: "E5 - Développement de la relation client et vente conseil", dateExcel: 46350, debut: "15:00", fin: "17:30" },
  { classe: "c_bts_sam_1a", matiere: "E5 - Développement de la relation client et vente conseil", dateExcel: 46364, debut: "15:00", fin: "17:30" },
  { classe: "c_bts_sam_1a", matiere: "E5 - Développement de la relation client et vente conseil", dateExcel: 46427, debut: "15:00", fin: "17:30" },
  { classe: "c_bts_sam_1a", matiere: "E5 - Développement de la relation client et vente conseil", dateExcel: 46455, debut: "15:00", fin: "17:30" },
  { classe: "c_bts_sam_1a", matiere: "E5 - Développement de la relation client et vente conseil", dateExcel: 46469, debut: "15:00", fin: "17:30" },
  { classe: "c_bts_sam_1a", matiere: "E5 - Développement de la relation client et vente conseil", dateExcel: 46483, debut: "15:00", fin: "17:30" },
  { classe: "c_bts_sam_1a", matiere: "E5 - Développement de la relation client et vente conseil", dateExcel: 46511, debut: "15:00", fin: "17:30" },
  { classe: "c_bts_sam_1a", matiere: "E5 - Développement de la relation client et vente conseil", dateExcel: 46525, debut: "15:00", fin: "17:30" },
  { classe: "c_bts_sam_1a", matiere: "E5 - Développement de la relation client et vente conseil", dateExcel: 46539, debut: "15:00", fin: "17:30" },
  { classe: "c_bts_sam_1a", matiere: "E5 - Développement de la relation client et vente conseil", dateExcel: 46553, debut: "15:00", fin: "17:30" },
  { classe: "c_bts_sam_1a", matiere: "E5 - Développement de la relation client et vente conseil", dateExcel: 46567, debut: "15:00", fin: "17:30" },
  { classe: "c_bts_sam_1a", matiere: "E8 - Management de l'équipe commerciale", dateExcel: 46266, debut: "13:30", fin: "17:30" },
  { classe: "c_bts_sam_1a", matiere: "E8 - Management de l'équipe commerciale", dateExcel: 46267, debut: "13:30", fin: "17:30" },
  { classe: "c_bts_sam_1a", matiere: "E8 - Management de l'équipe commerciale", dateExcel: 46294, debut: "15:00", fin: "17:30" },
  // Bachelor REM
  { classe: "c_bachelor_rem", matiere: "BLOC 1 - Coordonner et améliorer l'activité commerciale", dateExcel: 46272, debut: "08:30", fin: "12:30" },
  { classe: "c_bachelor_rem", matiere: "BLOC 1 - Coordonner et améliorer l'activité commerciale", dateExcel: 46279, debut: "08:30", fin: "12:30" },
  { classe: "c_bachelor_rem", matiere: "BLOC 1 - Coordonner et améliorer l'activité commerciale", dateExcel: 46286, debut: "08:30", fin: "12:30" },
  { classe: "c_bachelor_rem", matiere: "BLOC 1 - Coordonner et améliorer l'activité commerciale", dateExcel: 46293, debut: "08:30", fin: "12:30" },
  { classe: "c_bachelor_rem", matiere: "BLOC 1 - Coordonner et améliorer l'activité commerciale", dateExcel: 46300, debut: "08:30", fin: "12:30" },
  { classe: "c_bachelor_rem", matiere: "BLOC 1 - Coordonner et améliorer l'activité commerciale", dateExcel: 46307, debut: "08:30", fin: "12:30" },
  { classe: "c_bachelor_rem", matiere: "BLOC 1 - Coordonner et améliorer l'activité commerciale", dateExcel: 46314, debut: "08:30", fin: "12:30" },
  { classe: "c_bachelor_rem", matiere: "BLOC 1 - Coordonner et améliorer l'activité commerciale", dateExcel: 46328, debut: "08:30", fin: "12:30" },
  { classe: "c_bachelor_rem", matiere: "BLOC 1 - Coordonner et améliorer l'activité commerciale", dateExcel: 46342, debut: "08:30", fin: "12:30" },
  { classe: "c_bachelor_rem", matiere: "BLOC 1 - Coordonner et améliorer l'activité commerciale", dateExcel: 46349, debut: "08:30", fin: "12:30" },
  { classe: "c_bachelor_rem", matiere: "BLOC 1 - Coordonner et améliorer l'activité commerciale", dateExcel: 46356, debut: "08:30", fin: "12:30" },
  { classe: "c_bachelor_rem", matiere: "BLOC 1 - Coordonner et améliorer l'activité commerciale", dateExcel: 46363, debut: "08:30", fin: "12:30" },
  { classe: "c_bachelor_rem", matiere: "BLOC 1 - Coordonner et améliorer l'activité commerciale", dateExcel: 46419, debut: "08:30", fin: "12:30" },
  { classe: "c_bachelor_rem", matiere: "BLOC 1 - Coordonner et améliorer l'activité commerciale", dateExcel: 46426, debut: "08:30", fin: "12:30" },
  { classe: "c_bachelor_rem", matiere: "BLOC 1 - Coordonner et améliorer l'activité commerciale", dateExcel: 46433, debut: "08:30", fin: "12:30" },
  { classe: "c_bachelor_rem", matiere: "BLOC 1 - Coordonner et améliorer l'activité commerciale", dateExcel: 46454, debut: "08:30", fin: "12:30" },
  { classe: "c_bachelor_rem", matiere: "BLOC 1 - Coordonner et améliorer l'activité commerciale", dateExcel: 46461, debut: "08:30", fin: "12:30" },
  { classe: "c_bachelor_rem", matiere: "BLOC 1 - Coordonner et améliorer l'activité commerciale", dateExcel: 46482, debut: "08:30", fin: "12:30" },
  { classe: "c_bachelor_rem", matiere: "BLOC 1 - Coordonner et améliorer l'activité commerciale", dateExcel: 46489, debut: "08:30", fin: "12:30" },
  { classe: "c_bachelor_rem", matiere: "BLOC 1 - Coordonner et améliorer l'activité commerciale", dateExcel: 46503, debut: "08:30", fin: "12:30" },
  { classe: "c_bachelor_rem", matiere: "BLOC 1 - Coordonner et améliorer l'activité commerciale", dateExcel: 46510, debut: "08:30", fin: "12:30" },
  { classe: "c_bachelor_rem", matiere: "BLOC 1 - Coordonner et améliorer l'activité commerciale", dateExcel: 46517, debut: "08:30", fin: "12:30" },
  { classe: "c_bachelor_rem", matiere: "BLOC 1 - Coordonner et améliorer l'activité commerciale", dateExcel: 46525, debut: "08:30", fin: "12:30" },
  { classe: "c_bachelor_rem", matiere: "BLOC 1 - Coordonner et améliorer l'activité commerciale", dateExcel: 46531, debut: "08:30", fin: "12:30" },
  { classe: "c_bachelor_rem", matiere: "BLOC 1 - Coordonner et améliorer l'activité commerciale", dateExcel: 46538, debut: "08:30", fin: "12:30" },
  { classe: "c_bachelor_rem", matiere: "BLOC 1 - Coordonner et améliorer l'activité commerciale", dateExcel: 46545, debut: "08:30", fin: "12:30" },
  { classe: "c_bachelor_rem", matiere: "BLOC 1 - Coordonner et améliorer l'activité commerciale", dateExcel: 46547, debut: "09:00", fin: "12:30" },
  { classe: "c_bachelor_rem", matiere: "BLOC 1 - Coordonner et améliorer l'activité commerciale", dateExcel: 46547, debut: "13:30", fin: "17:30" },
  { classe: "c_bachelor_rem", matiere: "BLOC 1 - Coordonner et améliorer l'activité commerciale", dateExcel: 46552, debut: "08:30", fin: "12:30" },
  { classe: "c_bachelor_rem", matiere: "BLOC 1 - Coordonner et améliorer l'activité commerciale", dateExcel: 46559, debut: "08:30", fin: "12:30" },
  { classe: "c_bachelor_rem", matiere: "BLOC 1 - Coordonner et améliorer l'activité commerciale", dateExcel: 46566, debut: "08:30", fin: "12:30" },
  { classe: "c_bachelor_rem", matiere: "BLOC 1 - Coordonner et améliorer l'activité commerciale", dateExcel: 46573, debut: "08:30", fin: "12:30" },
  { classe: "c_bachelor_rem", matiere: "BLOC 1 - Coordonner et améliorer l'activité commerciale", dateExcel: 46574, debut: "09:00", fin: "12:30" },
  { classe: "c_bachelor_rem", matiere: "BLOC 1 - Coordonner et améliorer l'activité commerciale", dateExcel: 46574, debut: "13:30", fin: "17:30" },
  { classe: "c_bachelor_rem", matiere: "BLOC 1 - Coordonner et améliorer l'activité commerciale", dateExcel: 46575, debut: "08:30", fin: "12:30" },
  { classe: "c_bachelor_rem", matiere: "BLOC 1 - Coordonner et améliorer l'activité commerciale", dateExcel: 46575, debut: "13:30", fin: "17:30" },
  { classe: "c_bachelor_rem", matiere: "BLOC 1 - Coordonner et améliorer l'activité commerciale", dateExcel: 46576, debut: "08:30", fin: "12:30" },
  { classe: "c_bachelor_rem", matiere: "BLOC 1 - Coordonner et améliorer l'activité commerciale", dateExcel: 46576, debut: "13:30", fin: "17:30" },
  { classe: "c_bachelor_rem", matiere: "BLOC 2 - Contribuer aux orientations stratégiques", dateExcel: 46273, debut: "08:30", fin: "12:30" },
  { classe: "c_bachelor_rem", matiere: "BLOC 3 - Manager les salariés", dateExcel: 46272, debut: "13:30", fin: "17:30" },
  { classe: "c_bachelor_rem", matiere: "BLOC 3 - Manager les salariés", dateExcel: 46273, debut: "13:30", fin: "17:30" },
  { classe: "c_bachelor_rem", matiere: "BLOC 3 - Manager les salariés", dateExcel: 46286, debut: "13:30", fin: "17:30" },
  { classe: "c_bachelor_rem", matiere: "BLOC 3 - Manager les salariés", dateExcel: 46300, debut: "13:30", fin: "17:30" },
  { classe: "c_bachelor_rem", matiere: "BLOC 3 - Manager les salariés", dateExcel: 46307, debut: "13:30", fin: "17:30" },
  { classe: "c_bachelor_rem", matiere: "BLOC 3 - Manager les salariés", dateExcel: 46314, debut: "13:30", fin: "17:30" },
  { classe: "c_bachelor_rem", matiere: "BLOC 3 - Manager les salariés", dateExcel: 46356, debut: "13:30", fin: "17:30" },
  { classe: "c_bachelor_rem", matiere: "BLOC 3 - Manager les salariés", dateExcel: 46549, debut: "08:30", fin: "12:30" },
];

// Convertir les séances et les sauvegarder dans seancesCalendrier
const seancesCalendrier = seancesRaw.map((s, index) => {
  const date = excelDateToJS(s.dateExcel);
  const dateStr = date.toISOString().split('T')[0];
  return {
    id: `sc_2627_${index}`,
    anneeScolaireId: anneeScolaireId,
    classeId: s.classe,
    matiereNom: s.matiere,
    date: dateStr,
    heureDebut: s.debut,
    heureFin: s.fin,
    statut: "à faire",
    titre: s.matiere,
    type: "Cours",
    documents: [],
    note: "",
    etoiles: 0
  };
});

await setDoc(doc(db, "users", userId, "data", "seancesCalendrier_2627"), {
  seances: seancesCalendrier
});

console.log(`Import termine ! ${seancesCalendrier.length} seances importees pour 2026-2027`);
process.exit(0);
