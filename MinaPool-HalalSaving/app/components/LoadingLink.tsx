"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useNavigationLoader } from "./NavigationLoader";
import { ComponentProps, MouseEvent } from "react";

type LoadingLinkProps = ComponentProps<typeof Link>;

export default function LoadingLink({ href, onClick, children, ...props }: LoadingLinkProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { startLoading, stopLoading } = useNavigationLoader();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Call original onClick if provided
    if (onClick) {
      onClick(e);
    }

    // Don't show loading for same page navigation or hash links
    const targetPath = typeof href === 'string' ? href : href.pathname || '';
    if (targetPath === pathname || targetPath.startsWith('#')) {
      return;
    }

    // Don't interfere with modified clicks (new tab, etc.)
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      return;
    }

    // Prevent default navigation
    e.preventDefault();

    // Show loading
    startLoading();

    // Navigate programmatically
    router.push(targetPath);

    // Stop loading after a short delay (Next.js will handle the actual page transition)
    // This timeout ensures the loading screen shows briefly even for fast navigations
    setTimeout(() => {
      stopLoading();
    }, 500);
  };

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
