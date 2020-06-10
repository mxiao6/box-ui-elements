// @flow
import React from 'react';
import Media from '../../../../../components/media/Media';

import './LinkPreview.scss';

type LinkPreviewProps = {
    description: string,
    domain: string,
    img: string,
    link: string,
    title: string,
};

const LinkPreview = (props: LinkPreviewProps) => {
    const [errored, setErrored] = React.useState(false);

    return (
        <Media className="LinkPreview">
            <Media.Body>
                <span className="LinkPreview-title">
                    <a href={props.link} rel="noopener noreferrer" target="_blank">
                        {props.title}
                    </a>
                </span>
                <p>{props.description}</p>
            </Media.Body>
            {!!props.img && !errored && (
                <Media.Figure className="LinkPreview-image">
                    <img src={props.img} alt={props.title} width={48} onError={() => setErrored(true)} />
                </Media.Figure>
            )}
        </Media>
    );
};

export default LinkPreview;
