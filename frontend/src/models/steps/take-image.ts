export interface TakeImage {
    include_pointcloud: boolean,
    image_scope: "full_battery" | "section",
    center_x: number | null,
    center_y: number | null
}