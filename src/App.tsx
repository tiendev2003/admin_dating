import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Sidebar from './components/Layout/Sidebar';
import { AppProvider, useAppContext } from './contexts/AppContext';
import Dashboard from './pages/Dashboard';
import AddFaq from './pages/Faq/AddFaq';
import EditFaq from './pages/Faq/EditFaq';
import FAQList from './pages/Faq/ListFaq';
import AddInterest from './pages/Interest/AddInterest';
import EditInterest from './pages/Interest/EditInterest';
import ListInterest from './pages/Interest/ListInterest';
import AddLanguage from './pages/Language/AddLanguage';
import EditLanguage from './pages/Language/EditLanguage';
import ListLanguage from './pages/Language/ListLanguage';
import PaymentGatewayList from './pages/Payment/ListPayment';
import AddPlan from './pages/Plan/AddPlan';
import EditPlan from './pages/Plan/EditPlan';
import PlanList from './pages/Plan/ListPlan';
import AddRelationGoal from './pages/Relation_Goal/AddRelationGoal';
import EditRelationGoal from './pages/Relation_Goal/EditRelationGoal';
import RelationGoalList from './pages/Relation_Goal/ListRelationGoal';
import AddReligion from './pages/Religion/AddReligion';
import EditReligion from './pages/Religion/EditReligion';
import ReligionList from './pages/Religion/ListReligion';
import ListUser from './pages/Users/ListUser';
import UserInfo from './pages/Users/UserInfo';

const AppContent: React.FC = () => {
  const { isDarkMode } = useAppContext();

  return (
    <div className={`min-h-screen bg-background text-foreground ${isDarkMode ? 'dark' : ''}`}>
      <Router>
        <Sidebar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/plan" element={<PlanList />} />
          <Route path="/interest/add" element={<AddInterest />} />
          <Route path="/interest/edit/:id" element={<EditInterest />} />
          <Route path="/interest/list" element={<ListInterest />} />
          <Route path="/language/add" element={<AddLanguage />} />
          <Route path="/language/edit/:id" element={<EditLanguage />} />
          <Route path="/language/list" element={<ListLanguage />} />
          <Route path="/faq/list" element={<FAQList />} />
          <Route path="/faq/add" element={<AddFaq />} />
          <Route path="/faq/edit/:id" element={<EditFaq />} />
          <Route path="/plan/list" element={<PlanList />} />
          <Route path="/plan/edit/:id" element={<EditPlan />} />
          <Route path="/plan/add" element={<AddPlan />} />
          <Route path="/payments" element={<PaymentGatewayList />} />
          <Route path="/religion/list" element={<ReligionList />} />
          <Route path="/religion/edit/:id" element={<EditReligion />} />
          <Route path="/religion/add" element={<AddReligion />} />
          <Route path="/relation-goal/list" element={<RelationGoalList />} />
          <Route path="/relation-goal/edit/:id" element={<EditRelationGoal />} />
          <Route path="/relation-goal/add" element={<AddRelationGoal />} />
          <Route path="/users" element={<ListUser />} />
          <Route path="/users/:id" element={<UserInfo />} />
          <Route path="*" element={<h1>Not Found</h1>} />
        </Routes>
      </Router>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;