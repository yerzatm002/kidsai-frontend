import React from "react";
import {
  Box,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Stack,
  Button,
  Alert,
  Divider
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import StepTopicForm from "../../widgets/teacherWizard/StepTopicForm";
import StepLessonForm from "../../widgets/teacherWizard/StepLessonForm";
import StepTasksForm from "../../widgets/teacherWizard/StepTasksForm";
import StepTestForm from "../../widgets/teacherWizard/StepTestForm";
import StudentPreviewPanel from "../../widgets/teacherWizard/StudentPreviewPanel";

const steps = ["Тема", "Урок", "Задания", "Тест"];

export default function TeacherContentWizard() {
  const nav = useNavigate();
  const [activeStep, setActiveStep] = React.useState(0);

  // ids, которые приходят с backend:
  const [topicId, setTopicId] = React.useState(null);
  const [lessonId, setLessonId] = React.useState(null);
  const [testId, setTestId] = React.useState(null);

  // данные форм (локально)
  const [topic, setTopic] = React.useState({
    titleKz: "",
    titleRu: "",
    descriptionKz: "",
    descriptionRu: "",
    orderIndex: 1,
    coverImageUrl: ""
  });

  const [lesson, setLesson] = React.useState({
    contentKz: "",
    contentRu: "",
    imageUrl: "",
    videoUrl: ""
  });

  const [tasks, setTasks] = React.useState([
    // стартовый пример
    {
      type: "SIMPLE",
      promptKz: "",
      promptRu: "",
      xpReward: 10,
      payload: { options: ["", "", ""], correctIndex: 0 }
    }
  ]);

  const [test, setTest] = React.useState({
    titleKz: "Тест",
    titleRu: "Тест",
    questions: [
      {
        type: "SINGLE",
        promptKz: "",
        promptRu: "",
        options: ["", "", ""],
        correct: [0],
        points: 2
      }
    ]
  });

  const canGoBack = activeStep > 0;
  const goBack = () => setActiveStep((s) => Math.max(0, s - 1));

  const goNext = () => setActiveStep((s) => Math.min(steps.length - 1, s + 1));

  const finish = () => {
    // после финала — просто ведём учителя посмотреть /courses как ученик
    nav("/courses");
  };

  return (
    <Stack spacing={2.5}>
      <Card>
        <CardContent>
          <Typography variant="h4" sx={{ fontWeight: 900 }}>
            Мастер создания контента
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Заполните KZ и RU поля. После завершения тема появится у ученика в /courses.
          </Typography>

          <Box sx={{ mt: 2 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
        </CardContent>
      </Card>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1.25fr 0.75fr" },
          gap: 2
        }}
      >
        {/* Левая часть: формы */}
        <Stack spacing={2}>
          {activeStep === 0 ? (
            <StepTopicForm
              topic={topic}
              setTopic={setTopic}
              topicId={topicId}
              setTopicId={setTopicId}
              onSuccess={goNext}
            />
          ) : null}

          {activeStep === 1 ? (
            <>
              {!topicId ? (
                <Alert severity="warning" sx={{ borderRadius: 3 }}>
                  Сначала создайте тему.
                </Alert>
              ) : (
                <StepLessonForm
                  topicId={topicId}
                  lesson={lesson}
                  setLesson={setLesson}
                  lessonId={lessonId}
                  setLessonId={setLessonId}
                  onBack={goBack}
                  onSuccess={goNext}
                />
              )}
            </>
          ) : null}

          {activeStep === 2 ? (
            <>
              {!topicId ? (
                <Alert severity="warning" sx={{ borderRadius: 3 }}>
                  Сначала создайте тему.
                </Alert>
              ) : (
                <StepTasksForm
                  topicId={topicId}
                  tasks={tasks}
                  setTasks={setTasks}
                  onBack={goBack}
                  onSuccess={goNext}
                />
              )}
            </>
          ) : null}

          {activeStep === 3 ? (
            <>
              {!topicId ? (
                <Alert severity="warning" sx={{ borderRadius: 3 }}>
                  Сначала создайте тему.
                </Alert>
              ) : (
                <StepTestForm
                  topicId={topicId}
                  test={test}
                  setTest={setTest}
                  testId={testId}
                  setTestId={setTestId}
                  onBack={goBack}
                  onSuccess={finish}
                />
              )}
            </>
          ) : null}

          <Divider />

          <Stack direction="row" spacing={1}>
            <Button variant="outlined" disabled={!canGoBack} onClick={goBack}>
              Назад
            </Button>
            <Button variant="outlined" onClick={() => nav("/teacher/content")}>
              Выйти
            </Button>
          </Stack>
        </Stack>

        {/* Правая часть: Preview */}
        <StudentPreviewPanel
          topic={topic}
          lesson={lesson}
          tasks={tasks}
          test={test}
        />
      </Box>
    </Stack>
  );
}