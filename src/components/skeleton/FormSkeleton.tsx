import { Grid, Skeleton, Stack } from '@mui/material';

interface FormSkeletonField {
  md?: number;
}

interface FormSkeletonProps {
  fields: FormSkeletonField[];
  hasBlockEditor?: boolean;
}

export default function FormSkeleton({ fields, hasBlockEditor = true }: FormSkeletonProps) {
  return (
    <Stack spacing={3}>
      <Grid container spacing={2}>
        {/* Block editor / large content */}
        {hasBlockEditor && <Skeleton height={200} variant="rounded" />}

        {fields.map((field, index) => (
          <Grid item xs={12} md={field.md || 12} key={index}>
            <Stack spacing={1}>
              {/* Label */}
              <Skeleton height={20} width="40%" />

              {/* Input */}
              <Skeleton height={40} variant="rounded" />
            </Stack>
          </Grid>
        ))}
      </Grid>

      {/* Submit button */}
      <Skeleton height={45} width={150} variant="rounded" />
    </Stack>
  );
}
