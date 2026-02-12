import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

const AppleIcon = () => {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
          borderRadius: 36,
          fontSize: 100,
          fontWeight: "bold",
          color: "#000000",
        }}
      >
        G
      </div>
    ),
    {
      ...size,
    }
  );
};

export default AppleIcon;
