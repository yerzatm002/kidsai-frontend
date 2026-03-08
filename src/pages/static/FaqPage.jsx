import React from "react";
import { Accordion, AccordionSummary, AccordionDetails, Typography, Stack } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import QuizIcon from "@mui/icons-material/Quiz";
import { useTranslation } from "react-i18next";
import StaticPageShell from "./StaticPageShell";

export default function FaqPage() {
  const { t } = useTranslation();

  const items = [
    { q: t("pages.faq.q1"), a: t("pages.faq.a1") },
    { q: t("pages.faq.q2"), a: t("pages.faq.a2") },
    { q: t("pages.faq.q3"), a: t("pages.faq.a3") },
    { q: t("pages.faq.q4"), a: t("pages.faq.a4") }
  ];

  return (
    <StaticPageShell
      title={t("pages.faq.title")}
      subtitle={t("pages.faq.subtitle")}
      icon={<QuizIcon color="primary" />}
    >
      <Stack spacing={1.25}>
        {items.map((item, idx) => (
          <Accordion key={idx} sx={{ borderRadius: 3, overflow: "hidden" }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ fontWeight: 900 }}>{item.q}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                {item.a}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Stack>
    </StaticPageShell>
  );
}