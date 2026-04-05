⏺ Ya tengo el panorama completo. Actualmente tienes 14 productos hardcodeados en
lib/constants.ts con precio, stock, categorías, etc.

Para mover esto a una DB, te recomiendo esta stack (ideal para Next.js y fácil de  
 integrar después con pagos):

┌──────────────────┬────────────────────┬────────────────────────────────────────────┐
│ Componente │ Opción recomendada │ Por qué │  
 ├──────────────────┼────────────────────┼────────────────────────────────────────────┤  
 │ Base de datos │ Supabase │ Tier gratis generoso, dashboard para │
│ │ (PostgreSQL) │ gestionar productos, API REST automática │
├──────────────────┼────────────────────┼────────────────────────────────────────────┤  
 │ ORM │ Prisma │ Type-safe, se integra perfecto con │
│ │ │ TypeScript y Next.js │  
 ├──────────────────┼────────────────────┼────────────────────────────────────────────┤  
 │ Alternativa más │ Supabase directo │ Menos setup, el cliente JS ya viene tipado │
│ simple │ (sin ORM) │ │  
 └──────────────────┴────────────────────┴────────────────────────────────────────────┘

El plan sería:

1. Crear la tabla products en Supabase con los mismos campos que tu tipo Product
2. Instalar el cliente de Supabase (@supabase/supabase-js)
3. Crear un helper lib/supabase.ts para la conexión
4. Migrar los datos de constants.ts a la DB
5. Cambiar page.tsx para hacer fetch desde Supabase (Server Component, sin estado extra)
6. Eliminar PRODUCTS de constants.ts

Esto además te deja listo para después agregar: carrito, órdenes de compra, usuarios y  
 pagos.

¿Quieres que avance con esto? Y si tienes preferencia por alguna DB en particular  
 (Supabase, PlanetScale, MongoDB, etc.), dime.

✻ Brewed for 35s

❯ Entiendo. Esta integración es robusta y al momento de escalar e integrar con pasarelas  
de pago, no hay probabilidad de inyecciones o de filtración de datos?

⏺ Buena pregunta. Depende de cómo se implemente, pero te doy el panorama:

Supabase + Next.js es seguro si se configura bien:

- Inyección SQL: Supabase usa consultas parametrizadas por defecto (tanto su cliente JS  
  como Prisma). No concatenan strings SQL directamente, así que el riesgo es muy bajo
  siempre que no escribas queries raw sin parametrizar.
- Row Level Security (RLS): Supabase tiene RLS nativo en PostgreSQL. Puedes definir  
  políticas como "solo lectura pública para productos" y "solo admins pueden modificar  
  stock". Esto es una capa de seguridad a nivel de base de datos, no solo de aplicación.
- Filtración de datos: El riesgo principal está en exponer la clave de Supabase. Hay dos
  claves:
  - anon key (pública) — solo puede hacer lo que RLS permita
  - service_role key (privada) — acceso total, nunca debe llegar al cliente

Para pasarelas de pago, las consideraciones clave son:

- Nunca proceses tarjetas directamente. Stripe/Mercado Pago manejan los datos sensibles  
  en su infraestructura (PCI compliance). Tu servidor solo recibe tokens.
- Validar precios del lado del servidor. Nunca confíes en el precio que envía el frontend
  — siempre consulta la DB antes de crear la orden de pago.
- Webhooks firmados. Las pasarelas envían confirmaciones firmadas. Siempre verificar la
  firma para evitar que alguien simule un pago exitoso.

En resumen:

┌───────────────────────────┬────────────────────────────────────────────────────────┐
│ Riesgo │ Mitigación │
├───────────────────────────┼────────────────────────────────────────────────────────┤
│ SQL Injection │ Queries parametrizadas (Supabase/Prisma lo hacen por │
│ │ defecto) │
├───────────────────────────┼────────────────────────────────────────────────────────┤  
 │ Filtración de claves │ Variables de entorno + nunca exponer service_role al │  
 │ │ cliente │  
 ├───────────────────────────┼────────────────────────────────────────────────────────┤  
 │ Manipulación de precios │ Validar siempre en el servidor antes de cobrar │
├───────────────────────────┼────────────────────────────────────────────────────────┤  
 │ Pagos falsos │ Verificar firma de webhooks │
├───────────────────────────┼────────────────────────────────────────────────────────┤  
 │ Acceso no autorizado a │ RLS en Supabase │
│ datos │ │
└───────────────────────────┴────────────────────────────────────────────────────────┘

La stack es robusta para ecommerce. Los problemas de seguridad suelen venir de errores de
configuración, no de la tecnología en sí. Si seguimos buenas prácticas desde el inicio,
queda bien protegido.

¿Avanzamos con la implementación?
