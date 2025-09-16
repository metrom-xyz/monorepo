import { useStore } from "../store";
import { NotifyType } from "../types";
import { Button, Typography } from "@metrom-xyz/ui";
import { CircleCheckIcon } from "../assets/circle-check";
import { XIcon } from "../assets/x";
import { InfoIcon } from "../assets/info";
import { ErrorIcon } from "../assets/error";
import { ShieldIcon } from "../assets/shield";
import { LinkIcon } from "../assets/link";

const NOTIFICATION_COLORS = {
    [NotifyType.Success]: "green.500",
    [NotifyType.Error]: "red.400",
    [NotifyType.Info]: "blue.400",
    [NotifyType.Loading]: "blue.400",
    [NotifyType.Warning]: "yellow.400",
};

const NotificationIcons = {
    [NotifyType.Success]: CircleCheckIcon,
    [NotifyType.Error]: XIcon,
    [NotifyType.Info]: InfoIcon,
    [NotifyType.Warning]: ErrorIcon,
    [NotifyType.Blocked]: ShieldIcon,
};

const getIcon = (variant: NotifyType) => {
    if (variant === NotifyType.Loading) {
        return (
            <div className="w-24 h-24">
                {/* TODO: add progress circle */}
                {/* <ProgressCircleRoot value={null} size={"xl"} colorPalette={"blue"}>
          <ProgressCircleRing />
        </ProgressCircleRoot> */}
            </div>
        );
    }

    const Component = NotificationIcons[variant];

    return (
        <div style={{ color: NOTIFICATION_COLORS[variant] }}>
            <Component height={64} width={64} />
        </div>
    );
};

export const Notification = () => {
    const notification = useStore((state) => state.notification);
    const setNotification = useStore((state) => state.setNotification);
    // Testing purposes
    // useEffect(() => {
    //   setNotification({
    //     variant: NotifyType.Blocked,
    //     message: "Go direct to Uniswap interface",
    //     link: "https://basescan.org/tx/0xf7fd0e5153288af243be2dbc97884a766ca316d49a908bdd01191a3a8f8ac95f",
    //   });
    // }, []);

    if (!notification) return null;

    const handleClose = () => setNotification(undefined);

    return (
        <div className="w-full h-full">
            <div className="flex flex-col w-[95%] h-[95%] p-5 z-[1000]">
                {notification.variant !== NotifyType.Blocked && (
                    <Button
                        className={{ root: "absolute top-10 right-5 mr-5" }}
                    />
                )}
                <div className="flex flex-col w-full h-full justify-center content-center gap-2">
                    {getIcon(notification.variant)}

                    <Typography
                        size={
                            notification.variant === NotifyType.Warning
                                ? "lg"
                                : "xl"
                        }
                    >
                        {notification.message}
                    </Typography>

                    {notification.variant !== NotifyType.Blocked && (
                        <Button
                            mt={5}
                            w={200}
                            colorPalette={"black"}
                            onClick={handleClose}
                        >
                            Close
                        </Button>
                    )}
                    {notification.link && (
                        <Button
                            href={notification.link}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            View details
                            <LinkIcon height={14} width={14} />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Notification;
