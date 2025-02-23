import { OrganizationProfile } from "@clerk/nextjs";

export default function OrganizationSettingsPage() {
  return (
    <div className="w-full">
      <OrganizationProfile
        routing="hash"
        appearance={{
          elements: {
            rootBox: {
              width: "100%",
            },
            cardBox: {
              border: "1px solid #e5e5e5",
              boxShadow: "none",
              width: "100%",
            },
            scrollBox: {
              borderTopLeftRadius: "0",
              borderBottomLeftRadius: "0",
            }
          },
        }}
      />
    </div>
  );
}
