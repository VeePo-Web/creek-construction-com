# Fix build error: remove orphaned blog files

## Context

The Creek Construction rebrand removed the blog from routing (`App.tsx`) and navigation (`Navigation.tsx`, `Footer.tsx`), but the underlying files were left behind:

- `src/pages/Blog.tsx`
- `src/pages/BlogPost.tsx`
- `src/data/blogPosts.ts`

`BlogPost.tsx` imports `ArticleJsonLd` from `@/components/JsonLd`, which no longer exists after `JsonLd.tsx` was rewritten with the `GeneralContractor` schema. That broken import is what's failing the build:

```
src/pages/BlogPost.tsx(11,10): error TS2614: Module '"@/components/JsonLd"' has no exported member 'ArticleJsonLd'.
```

Creek Construction has no blog/resources section, so the right fix is to delete the orphaned files (not patch the import).

## Steps

1. **Delete orphaned blog files**
   - `src/pages/Blog.tsx`
   - `src/pages/BlogPost.tsx`
   - `src/data/blogPosts.ts`

2. **Verify no other references**
   - `rg` for `blogPosts`, `from "@/pages/Blog`, `ArticleJsonLd` to confirm nothing else breaks.

3. **Confirm build is clean**
   - TS2614 error resolved; site compiles; `/`, `/services`, `/work`, `/about`, `/contact` all render.

## Out of scope

- Anything from the unrelated musician-website message — explicitly ignored per your reply.
- Real project photos, email-domain verification, and any new features. Just unblocking the build.