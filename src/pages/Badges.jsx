import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Button,
  Skeleton,
  Alert
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link as RouterLink } from "react-router-dom";

import { useTranslation } from "react-i18next";
import { useLang } from "../shared/hooks/useLang";
import { useNotify } from "../shared/ui/notifications/NotificationsProvider";
import { normalizeApiError } from "../shared/api/apiClient";
import { getMyBadges } from "../shared/api/dashboardApi";

import BadgeCard from "../widgets/badges/BadgeCard";

export default function Badges() {
  const { t } = useTranslation();
  const lang = useLang();
  const { notify } = useNotify();

  const [loading, setLoading] = React.useState(true);
  const [items, setItems] = React.useState([]);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await getMyBadges(); // { items:[...] } 
      setItems(data?.items || []);
    } catch (e) {
      const err = normalizeApiError(e);
      notify(err.message, "error");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [notify]);

  React.useEffect(() => {
    load();
  }, [load, lang]);

  return (
    <Stack spacing={2.5}>
      <Card>
        <CardContent>
          <Typography variant="h4" sx={{ fontWeight: 900 }}>
            {t("gami.badgesTitle")}
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            {t("gami.badgesSubtitle")}
          </Typography>

          <Button
            component={RouterLink}
            to="/me"
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            sx={{ mt: 2 }}
          >
            Назад
          </Button>
        </CardContent>
      </Card>

      {loading ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
            gap: 2
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" height={120} />
          ))}
        </Box>
      ) : items.length === 0 ? (
        <Alert severity="info" sx={{ borderRadius: 3 }}>
          {t("gami.noBadges")}
        </Alert>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
            gap: 2
          }}
        >
          {items.map((b, idx) => (
            <BadgeCard key={`${b.code}-${idx}`} badge={b} />
          ))}
        </Box>
      )}
    </Stack>
  );
}