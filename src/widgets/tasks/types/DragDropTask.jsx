import React from "react";
import { Box, Typography, Card, CardContent, List, ListItem, ListItemText } from "@mui/material";
import { useTranslation } from "react-i18next";

import {
  DndContext,
  closestCenter
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableRow({ id, text }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    borderRadius: 12,
    background: isDragging ? "rgba(47,128,237,0.15)" : "rgba(47,128,237,0.06)",
    marginBottom: 10,
    cursor: "grab"
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <ListItem>
        <ListItemText
          primary={
            <Typography sx={{ fontWeight: 800, fontSize: "1.05rem" }}>
              {text}
            </Typography>
          }
        />
      </ListItem>
    </div>
  );
}

export default function DragDropTask({ task, onAnswerChange }) {
  const { t } = useTranslation();
  const prompt = task.prompt || "";

  const rawItems = task.payload?.items || [];

  // нормализуем в [{id, text}]
  const initial = React.useMemo(() => {
    return rawItems.map((it, idx) => {
      if (typeof it === "string") return { id: `i-${idx}`, text: it };
      return { id: it.id ? String(it.id) : `i-${idx}`, text: it.text ?? it.label ?? `Item ${idx + 1}` };
    });
  }, [rawItems]);

  const [items, setItems] = React.useState(initial);

  React.useEffect(() => {
    setItems(initial);
    onAnswerChange(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task.id]);

  React.useEffect(() => {
    // answerPayload: порядок id (или текстов) — сервер сам проверит
    const order = items.map((x) => x.id);
    onAnswerChange({ order });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const onDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setItems((prev) => {
      const oldIndex = prev.findIndex((x) => x.id === active.id);
      const newIndex = prev.findIndex((x) => x.id === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 900, mb: 0.5 }}>
        {prompt}
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 1.5 }}>
        {t("tasks.dndHint")}
      </Typography>

      <Card sx={{ bgcolor: "rgba(47,128,237,0.04)" }}>
        <CardContent>
          <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={items.map((x) => x.id)} strategy={verticalListSortingStrategy}>
              <List disablePadding>
                {items.map((x) => (
                  <SortableRow key={x.id} id={x.id} text={x.text} />
                ))}
              </List>
            </SortableContext>
          </DndContext>
        </CardContent>
      </Card>
    </Box>
  );
}