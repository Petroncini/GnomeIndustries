export type SideNavItem = {
    title: string;
    path: string;
    icon?: JSX.Element;
    subMenu?: boolean;
    subMenuItems?: SideNavItem[];
};