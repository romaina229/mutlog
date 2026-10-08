import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { PublicHomePage } from './pages/public/PublicHomePage'
import { TransportSearchPage } from './pages/public/TransportSearchPage'
import { LoginPage } from './pages/public/LoginPage'
import { RegisterPage } from './pages/public/RegisterPage'
import { PublicInfoPage } from './pages/public/PublicInfoPage'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { ClientWorkspacePage } from './pages/app/ClientWorkspacePage'
import { TransporteurDashboardPage } from './pages/app/TransporteurDashboardPage'
import './styles/global.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicHomePage />} />
        <Route path="/rechercher" element={<TransportSearchPage />} />
        <Route path="/connexion" element={<LoginPage />} />
        <Route path="/inscription" element={<RegisterPage />} />

        <Route path="/client/*" element={<ProtectedRoute allowedRoles={['client']}><ClientWorkspacePage /></ProtectedRoute>} />
        <Route path="/transporteur" element={<ProtectedRoute allowedRoles={['transporteur']}><TransporteurDashboardPage /></ProtectedRoute>} />

        <Route path="/comment-ca-marche" element={<PublicInfoPage eyebrow="Comment ça marche" title="Mutualisez un transport plus simplement." description="Publiez votre besoin, trouvez une capacité compatible, puis laissez MUTLOG faciliter la mise en relation et la mutualisation." />} />
        <Route path="/services" element={<PublicInfoPage eyebrow="Nos services" title="Une plateforme pensée pour l'offre et la demande de transport." description="MUTLOG réunit recherche, matching, mutualisation, réservation, suivi et évaluation dans un même espace." />} />
        <Route path="/a-propos" element={<PublicInfoPage eyebrow="À propos" title="Une solution conçue pour le transport de marchandises au Bénin." description="MUTLOG est pensée pour les producteurs, commerçants, PME, coopératives et transporteurs qui souhaitent mieux valoriser les capacités disponibles." />} />
        <Route path="/contact" element={<PublicInfoPage eyebrow="Contact" title="Parlons de votre besoin de transport." description="L'espace de contact sera relié à la gestion des demandes et notifications de la plateforme." actionLabel="Créer une demande" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
