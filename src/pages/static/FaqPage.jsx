import React from "react";
import { Accordion, AccordionSummary, AccordionDetails, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useTranslation } from "react-i18next";
import StaticPageShell from "./StaticPageShell";

export default function FaqPage() {
  const { t } = useTranslation();

  return (
    <StaticPageShell title={t("pages.faq.title")}>
      <Accordion sx={{ borderRadius: 3, mb: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontWeight: 900 }}>{t("pages.faq.q1")}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{t("pages.faq.a1")}</Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion sx={{ borderRadius: 3 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontWeight: 900 }}>{t("pages.faq.q2")}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{t("pages.faq.a2")}</Typography>
        </AccordionDetails>
      </Accordion>
    </StaticPageShell>
  );
}