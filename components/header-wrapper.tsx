import { Header } from "@/components/header";
import { getContentGroup } from "@/lib/site-content";

export async function HeaderWrapper() {
  const settings = await getContentGroup("site_settings");

  return (
    <Header
      logoUrl={settings.site_logo || "/fair-fresh-logo.svg"}
      phone={settings.site_phone || "0430 799 567"}
    />
  );
}
