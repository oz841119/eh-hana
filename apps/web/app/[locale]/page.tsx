import { ComponentExample } from "@/components/component-example";
import { getTranslations } from "next-intl/server";

export default async function Page() {
  const t = await getTranslations();
  return (
    <div>
      {t('common.hello')}
      <ComponentExample />
    </div>
  );
}