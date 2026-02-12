import { ImageResponse } from "next/og";

export const alt =
  "Gram Kumbaram - Fiziksel Altın Takip ve Portföy Yönetimi";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const OgImage = () => {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)",
        }}
      >
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            background:
              "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 64,
            fontWeight: "bold",
            color: "#000",
            marginBottom: 32,
          }}
        >
          G
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 16,
          }}
        >
          <span
            style={{
              fontSize: 56,
              fontWeight: "bold",
              color: "#FFD700",
            }}
          >
            Gram
          </span>
          <span
            style={{
              fontSize: 56,
              fontWeight: "bold",
              color: "#ffffff",
            }}
          >
            Kumbaram
          </span>
        </div>

        <div
          style={{
            fontSize: 24,
            color: "#a0a0a0",
            textAlign: "center",
            maxWidth: 600,
            lineHeight: 1.4,
          }}
        >
          Fiziksel Altin Yatirimlarinizi Takip Edin
        </div>

        <div
          style={{
            display: "flex",
            gap: 16,
            marginTop: 32,
          }}
        >
          {["Canli Fiyatlar", "Hesaplayici", "Portfoy Yonetimi"].map(
            (feature) => (
              <div
                key={feature}
                style={{
                  padding: "8px 20px",
                  borderRadius: 20,
                  border: "1px solid rgba(255, 215, 0, 0.3)",
                  color: "#FFD700",
                  fontSize: 16,
                }}
              >
                {feature}
              </div>
            )
          )}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
};

export default OgImage;
