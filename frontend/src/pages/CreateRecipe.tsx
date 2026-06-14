import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  Box,
  Paper,
  Stack,
  Typography,
  TextField,
  Button,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import useCreateRecipe from "../hooks/useCreateRecipe";
import { useNavigate, useParams } from "react-router";
import useRecipe from "../hooks/useRecipe";
import StepCard from "../components/StepDetails";
import validateStep from "../validators/recipe";
import createEmptyStep from "../utils/createEmptyStep";
import buildPayload from "../utils/buildRecipePayload";
import useEditRecipe from "../hooks/useEditRecipe";

export default function RecipeCreatePage() {
  const { id } = useParams<{ id: string }>();
  const navigator = useNavigate();
  const [recipe, setRecipe] = useState({ name: "", description: "" });
  const [steps, setSteps] = useState([createEmptyStep()]);
  const [stepErrors, setStepErrors] = useState<any>({});
  const [recipeNameError, setRecipeNameError] = useState("");

  const createMutation = useCreateRecipe();
  const editMutation = useEditRecipe();
  const { data: recipeData, isLoading: isRecipeLoading, error: recipeError } = useRecipe(id);

  const handleAddStep = (index: number) => {
    setSteps((prev) => {
      const newList = [...prev];
      newList.splice(index + 1, 0, createEmptyStep());
      return newList;
    });
  };

  const handleStepChange = (localId: string, patch: any) => {
    setSteps((prev) =>
      prev.map((s) => (s.localId === localId ? { ...s, ...patch } : s))
    );
  };

  const handleRemoveStep = (localId: string) => {
    setSteps((prev) => prev.filter((s) => s.localId !== localId));
    setStepErrors((prev: any) => {
      const next: any = { ...prev };
      delete next[localId];
      return next;
    });
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;

    setSteps((prev) => {
      const next = [...prev];
      const [moved] = next.splice(result.source.index, 1);
      next.splice(result.destination.index, 0, moved);
      return next;
    });
  };

  const handleSave = () => {
    let hasError = false;

    if (!recipe.name.trim()) {
      setRecipeNameError("Recipe name is required");
      hasError = true;
    } else {
      setRecipeNameError("");
    }

    const allErrors: any = {};
    steps.forEach((step) => {
      const errors = validateStep(step);
      if (Object.keys(errors).length > 0) {
        allErrors[step.localId] = errors;
        hasError = true;
      }
    });
    setStepErrors(allErrors);

    if (steps.length === 0) {
      hasError = true;
    }

    if (hasError) return;

    const payload = buildPayload(recipe, steps) as any;
    if (id) {
      editMutation.mutate({ id, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  useEffect(() => {
    if (createMutation.isSuccess || editMutation.isSuccess) {
      navigator("/");
    }
  }, [navigator, createMutation.isSuccess, editMutation.isSuccess]);

  useEffect(() => {
    if (id && recipeData) {
      setRecipe({
        name: recipeData.name,
        description: recipeData.description || "",
      });
      setSteps(
        recipeData.steps.map((s: any) => ({
          localId: `server-${s.id}`,
          step_type: s.step_type,
          name: s.name,
          description: s.description || "",
          ...s.properties,
        }))
      );
    }
  }, [id, recipeData]);

  return (
    <Box
      sx={{
        maxWidth: 760,
        mx: "auto",
        py: 4,
        px: 2,
      }}
    >
      <Stack spacing={3}>
        {!id && (
          <Box>
            <Typography variant="h5" fontWeight={500}>
              New recipe
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Build the sequence of steps the robotic arm will follow.
            </Typography>
          </Box>
        )}

        <Paper
          variant="outlined"
          sx={{ p: 2.5, borderRadius: 2, borderColor: "divider" }}
        >
          <Stack spacing={2}>
            <TextField
              label="Recipe name"
              size="small"
              fullWidth
              value={recipe.name}
              onChange={(e) => setRecipe((r) => ({ ...r, name: e.target.value }))}
              error={Boolean(recipeNameError)}
              helperText={recipeNameError}
            />
            <TextField
              label="Description"
              size="small"
              fullWidth
              multiline
              minRows={2}
              value={recipe.description}
              onChange={(e) =>
                setRecipe((r) => ({ ...r, description: e.target.value }))
              }
            />
          </Stack>
        </Paper>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle1" fontWeight={500}>
            Steps
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {steps.length} {steps.length === 1 ? "step" : "steps"}
          </Typography>
        </Stack>

        {steps.length === 0 && (
          <Paper
            variant="outlined"
            sx={{
              p: 4,
              textAlign: "center",
              borderRadius: 2,
              borderStyle: "dashed",
              borderColor: "divider",
              color: "text.secondary",
            }}
          >
            <Typography variant="body2">
              No steps yet. Add a step to start building this recipe.
            </Typography>
          </Paper>
        )}

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="steps">
            {(provided) => (
              <Stack
                spacing={2}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {steps.map((step, index) => (
                  <Draggable key={step.localId} draggableId={step.localId} index={index}>
                    {(provided) => (
                      <Stack
                        spacing={2}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                      >
                        <StepCard
                          step={step}
                          index={index}
                          errors={stepErrors[step.localId] || {}}
                          onChange={handleStepChange}
                          onRemove={handleRemoveStep}
                          dragHandleProps={provided.dragHandleProps}
                        />

                        <Button
                          variant="outlined"
                          startIcon={<AddIcon />}
                          onClick={() => handleAddStep(index)}
                          sx={{
                            alignSelf: "center",
                            borderRadius: 2,
                            borderColor: "divider",
                            color: "text.primary",
                            "&:hover": {
                              borderColor: "#0F6E56",
                              bgcolor: "rgba(15,110,86,0.04)",
                            },
                          }}
                        >
                          Add step
                        </Button>
                      </Stack>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Stack>
            )}
          </Droppable>
        </DragDropContext>

        <Divider />

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            {(createMutation.isError || editMutation.isError) && (
              <Typography variant="body2" color="error">
                {(createMutation.error as any)?.message || (editMutation.error as any)?.message || "Something went wrong."}
              </Typography>
            )}
            {(createMutation.isSuccess || editMutation.isSuccess) && (
              <Typography variant="body2" sx={{ color: "#0F6E56" }}>
                Recipe saved.
              </Typography>
            )}
          </Box>

          <Button
            variant="contained"
            startIcon={<SaveOutlinedIcon />}
            onClick={handleSave}
            disabled={createMutation.isPending || editMutation.isPending}
          >
            {createMutation.isPending || editMutation.isPending ? "Saving..." : id ? "Update Recipe" : "Create Recipe"}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}