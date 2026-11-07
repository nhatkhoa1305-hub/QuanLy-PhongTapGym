import ClassesPage from './components/ClassesPage.jsx'
import Dashboard from './components/Dashboard.jsx'
import EntityDialog from './components/EntityDialog.jsx'
import HistoryPage from './components/HistoryPage.jsx'
import MembersPage from './components/MembersPage.jsx'
import PackagesPage from './components/PackagesPage.jsx'
import RegistrationsPage from './components/RegistrationsPage.jsx'
import ReportsPage from './components/ReportsPage.jsx'
import Sidebar from './components/Sidebar.jsx'
import SubscriptionsPage from './components/SubscriptionsPage.jsx'
import Toast from './components/Toast.jsx'
import Topbar from './components/Topbar.jsx'
import TrainersPage from './components/TrainersPage.jsx'
import UsersPage from './components/UsersPage.jsx'
import useGymState from './hooks/useGymState.js'
import '../old code/style.css'
import './App.css'

function App() {
  const gym = useGymState()
  const onCreate = () => gym.handleAction({ action: 'create' })
  let page

  switch (gym.currentView) {
    case 'members':
      page = <MembersPage data={gym.data} searchTerm={gym.searchTerm} canManage={gym.canManage()} onAction={gym.handleAction} />
      break
    case 'packages':
      page = <PackagesPage data={gym.data} searchTerm={gym.searchTerm} canManage={gym.canManage()} onAction={gym.handleAction} />
      break
    case 'subscriptions':
      page = <SubscriptionsPage data={gym.data} searchTerm={gym.searchTerm} canManage={gym.canManage()} onAction={gym.handleAction} />
      break
    case 'classes':
      page = <ClassesPage data={gym.data} searchTerm={gym.searchTerm} canManage={gym.canManage()} rosterClassId={gym.rosterClassId} onAction={gym.handleAction} />
      break
    case 'trainers':
      page = <TrainersPage data={gym.data} searchTerm={gym.searchTerm} canManage={gym.canManage()} onAction={gym.handleAction} />
      break
    case 'registrations':
      page = <RegistrationsPage data={gym.data} searchTerm={gym.searchTerm} canManage={gym.canManage()} onAction={gym.handleAction} />
      break
    case 'history':
      page = <HistoryPage data={gym.data} searchTerm={gym.searchTerm} selectedMemberId={gym.historyMemberId} onSelectMember={gym.selectHistoryMember} />
      break
    case 'reports':
      page = <ReportsPage data={gym.data} onAction={gym.handleAction} />
      break
    case 'users':
      page = <UsersPage data={gym.data} searchTerm={gym.searchTerm} role={gym.role} canManage={gym.canManage()} onAction={gym.handleAction} />
      break
    default:
      page = <Dashboard data={gym.data} onAction={gym.handleAction} />
  }

  return (
    <div className="app-shell">
      <Sidebar currentView={gym.currentView} onNavigate={gym.navigate} />
      <main className="content">
        <Topbar
          currentView={gym.currentView}
          searchTerm={gym.searchTerm}
          onSearch={gym.setSearchTerm}
          role={gym.role}
          roles={gym.roles}
          onRoleChange={gym.changeRole}
          onCreate={onCreate}
        />
        <section id="appView" aria-live="polite">{page}</section>
      </main>
      <EntityDialog dialog={gym.dialog} fields={gym.formFields} onClose={gym.closeDialog} onSubmit={gym.submitForm} />
      <Toast toast={gym.toast} onDismiss={gym.setToast} />
    </div>
  )
}

export default App
