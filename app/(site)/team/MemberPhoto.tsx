import Image from "next/image";
import { ReactElement } from "react";
import { getMemberImageSrc } from "./types";

export function MemberPhoto({
    name,
    size = 200,
    className,
}: {
    name: string;
    size?: number;
    className?: string;
}): ReactElement {
    return (
        <Image
            src={getMemberImageSrc(name)}
            alt={name}
            width={size}
            height={size}
            style={{ objectFit: "cover" }}
            className={className}
        />
    );
}
