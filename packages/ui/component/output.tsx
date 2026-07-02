import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

type OutputProps = {
  res: string;
};

export function Output({ res }: OutputProps) {
  return (
    <Card
      sx={{
        maxWidth: 800,
        marginTop: 2,
        padding: 1,
        borderRadius: 3,
      }}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom>
          AI Response
        </Typography>

        <Typography
          variant="body1"
          sx={{
            whiteSpace: "pre-wrap",
            lineHeight: 1.8,
          }}
        >
          {res}
        </Typography>
      </CardContent>
    </Card>
  );
}