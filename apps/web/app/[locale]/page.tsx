import { ComponentExample } from "@/components/component-example";
import { GoogleLoginButton } from "@/components/GoogleLoginButton/GoogleLoginButton";
import { getTranslations } from "next-intl/server"; 
export default async function Page() {
  const t = await getTranslations();
return <div>
  {t('common.hello')}
  <GoogleLoginButton />
  <ComponentExample />
</div>;
} 