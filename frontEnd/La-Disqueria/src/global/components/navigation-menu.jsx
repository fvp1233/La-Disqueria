import * as React from "react"
import { NavigationMenu as NavigationMenuPrimitive } from "@base-ui/react/navigation-menu"
import { cva } from "class-variance-authority"
import { cn } from "@/global/lib/utils"
import { ChevronDownIcon } from "lucide-react"

function NavigationMenu({
  align = "start",
  className,
  children,
  ...props
}) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      className={cn(
        "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
        className
      )}
      {...props}>
      {children}
      {/* El Positioner es global al Root en Base UI para manejar el Viewport */}
      <NavigationMenuPositioner align={align} />
    </NavigationMenuPrimitive.Root>
  );
}

function NavigationMenuList({ className, ...props }) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn("group flex flex-1 list-none items-center justify-center gap-1", className)}
      {...props} />
  );
}

function NavigationMenuItem({ className, ...props }) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      className={cn("relative", className)}
      {...props} />
  );
}

const navigationMenuTriggerStyle = cva(
  "group/navigation-menu-trigger inline-flex h-9 w-max items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition-colors outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[popup-open]:bg-accent/50", "text-slate-700", "hover:text-white", "data-[popup-open]:text-white"
)

function NavigationMenuTrigger({ className, children, ...props }) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(navigationMenuTriggerStyle(), className)}
      {...props}>
      {children}
      <ChevronDownIcon
        className="relative top-px ml-1 size-3 transition duration-300 group-data-popup-open/navigation-menu-trigger:rotate-180"
        aria-hidden="true" />
    </NavigationMenuPrimitive.Trigger>
  );
}

function NavigationMenuContent({ className, ...props }) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn(
        // Clases de Base UI para animaciones de entrada/salida
        "w-full p-4 transition-[opacity,transform] duration-300 data-starting-style:opacity-0 data-ending-style:opacity-0",
        className
      )}
      {...props} />
  );
}

function NavigationMenuPositioner({
  className,
  side = "bottom",
  sideOffset = 10,
  align = "start",
  ...props
}) {
  return (
    <NavigationMenuPrimitive.Portal>
      <NavigationMenuPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        className={cn("z-50", className)}
        {...props}>
        <NavigationMenuPrimitive.Popup
          className={cn(
            "relative mt-1.5 overflow-hidden rounded-md  bg-popover text-popover-foreground ",
            "h-(--popup-height) w-(--popup-width) transition-[width,height] duration-300 ease-in-out"
          )}
          
        >
          {/* El Viewport es esencial para que el contenido cambie de tamaño suavemente */}
          <NavigationMenuPrimitive.Viewport className="size-full" />
        </NavigationMenuPrimitive.Popup>
      </NavigationMenuPrimitive.Positioner>
    </NavigationMenuPrimitive.Portal>
  );
}

function NavigationMenuLink({ className, ...props }) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(
        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
        className
      )}
      {...props} />
  );
}

export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  NavigationMenuPositioner,
}