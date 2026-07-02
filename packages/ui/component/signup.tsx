import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

export function SignUp() {
  return (
    <>
      {" "}
      <Card variant="outlined">
        {
          <div>
            <input type="text" placeholder="Enter Name" />
            <input type="text" placeholder="Enter Password" />
            <button> submit </button>
          </div>
        }
      </Card>
    </>
  );
}
