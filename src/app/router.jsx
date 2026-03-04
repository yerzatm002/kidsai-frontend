import React from "react";
import { createBrowserRouter } from "react-router-dom";
import AppShell from "../widgets/AppShell/AppShell";

import Home from "../pages/Home";
import Courses from "../pages/Courses";
import About from "../pages/static/AboutPage";
import FAQ from "../pages/static/FaqPage";
import Security from "../pages/static/SecurityPage";
import Contact from "../pages/static/ContactPage";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import Me from "../pages/Me";
import TeacherHome from "../pages/teacher/TeacherHome";
import TeacherContentHome from "../pages/teacher/TeacherContentHome";
import TeacherContentWizard from "../pages/teacher/TeacherContentWizard";
import TeacherStudents from "../pages/teacher/TeacherStudents";
import TeacherFeedback from "../pages/teacher/TeacherFeedback";

import Topic from "../pages/Topic";
import Lesson from "../pages/Lesson";
import Tasks from "../pages/Tasks";
import Test from "../pages/Test";
import Dashboard from "../pages/Dashboard";
import Badges from "../pages/Badges";

import { RequireAuth, RequireRole } from "../shared/auth/guards";

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/courses", element: <Courses /> },
      { path: "/topics/:id", element: <Topic /> },
      { path: "/topics/:id/lesson", element: <Lesson /> },
      { path: "/topics/:id/tasks", element: <Tasks /> },
      { path: "/topics/:id/test", element: <Test /> },
      
      { path: "/about", element: <About /> },
      { path: "/faq", element: <FAQ /> },
      { path: "/security", element: <Security /> },
      { path: "/contact", element: <Contact /> },

      { path: "/auth/login", element: <Login /> },
      { path: "/auth/register", element: <Register /> },

      {
        path: "/me",
        element: (
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        )
      },

      {
        path: "/badges",
        element: (
          <RequireRole role="STUDENT">
            <Badges />
          </RequireRole>
        )
      },

      {
        path: "/teacher/content",
        element: (
          <RequireAuth>
            <RequireRole role="TEACHER">
              <TeacherContentHome />
            </RequireRole>
          </RequireAuth>
        )
      },
      {
        path: "/teacher/content/new",
        element: (
          <RequireAuth>
            <RequireRole role="TEACHER">
              <TeacherContentWizard />
            </RequireRole>
          </RequireAuth>
        )
      },

      {
        path: "/teacher/students",
        element: (
          <RequireAuth>
            <RequireRole role="TEACHER">
              <TeacherStudents />
            </RequireRole>
          </RequireAuth>
        )
      },

      {
        path: "/teacher/feedback",
        element: (
          <RequireAuth>
            <RequireRole role="TEACHER">
              <TeacherFeedback />
            </RequireRole>
          </RequireAuth>
        )
      },

      {
        path: "/teacher",
        element: (
          <RequireRole role="TEACHER">
            <TeacherHome />
          </RequireRole>
        )
      }
    ]
  }
]);