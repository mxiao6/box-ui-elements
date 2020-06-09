// @flow
import * as React from 'react';
import axios from 'axios';
import noop from 'lodash/noop';
import LoadingIndicator from '../../../../../components/loading-indicator';
import formatTaggedMessage, { getUrlsFromMessage } from '../../utils/formatTaggedMessage';
import ShowOriginalButton from './ShowOriginalButton';
import TranslateButton from './TranslateButton';
import type { GetProfileUrlCallback } from '../../../../common/flowTypes';
import './ActivityMessage.scss';

type LinkPreviewItem = {
    description: string,
    domain: string,
    img: string,
    title: string,
};

type Props = {
    getUserProfileUrl?: GetProfileUrlCallback,
    id: string,
    onTranslate?: Function,
    tagged_message: string,
    translatedTaggedMessage?: string,
    translationEnabled?: boolean,
    translationFailed?: ?boolean,
};

type State = {
    isLoading?: boolean,
    isTranslation?: boolean,
    linkPreviewItems?: LinkPreviewItem[],
};

class ActivityMessage extends React.Component<Props, State> {
    static defaultProps = {
        translationEnabled: false,
    };

    constructor(props: Props) {
        super(props);

        this.state = {
            isLoading: false,
            isTranslation: false,
        };

        this.getUrlPreview(props.tagged_message);
    }

    componentDidUpdate(prevProps: Props): void {
        const { translatedTaggedMessage, translationFailed } = this.props;
        const { translatedTaggedMessage: prevTaggedMessage, translationFailed: prevTranslationFailed } = prevProps;

        if (prevTaggedMessage === translatedTaggedMessage || prevTranslationFailed === translationFailed) {
            return;
        }

        if (translatedTaggedMessage || translationFailed) {
            this.setState({ isLoading: false });
        }
    }

    getUrlPreview = (taggedMessage: string): void => {
        axios
            .get('https://us-central1-lofty-totality-204620.cloudfunctions.net/link-preview-hackathon', {
                params: {
                    q: getUrlsFromMessage(taggedMessage).join(','),
                },
            })
            .then(res => {
                this.setState({
                    linkPreviewItems: res.data,
                });
            });
    };

    getButton(isTranslation?: boolean): React.Node {
        let button = null;
        if (isTranslation) {
            button = <ShowOriginalButton handleShowOriginal={this.handleShowOriginal} />;
        } else {
            button = <TranslateButton handleTranslate={this.handleTranslate} />;
        }

        return button;
    }

    handleTranslate = (event: SyntheticMouseEvent<>): void => {
        const { id, tagged_message, onTranslate = noop, translatedTaggedMessage } = this.props;
        if (!translatedTaggedMessage) {
            this.setState({ isLoading: true });
            onTranslate({ id, tagged_message });
        }

        this.setState({ isTranslation: true });
        event.preventDefault();
    };

    handleShowOriginal = (event: SyntheticMouseEvent<>): void => {
        this.setState({ isTranslation: false });
        event.preventDefault();
    };

    render(): React.Node {
        const { id, tagged_message, translatedTaggedMessage, translationEnabled, getUserProfileUrl } = this.props;
        const { isLoading, isTranslation, linkPreviewItems } = this.state;
        const commentToDisplay =
            translationEnabled && isTranslation && translatedTaggedMessage ? translatedTaggedMessage : tagged_message;
        return isLoading ? (
            <div className="bcs-ActivityMessageLoading">
                <LoadingIndicator size="small" />
            </div>
        ) : (
            <div className="bcs-ActivityMessage">
                {formatTaggedMessage(commentToDisplay, id, false, getUserProfileUrl)}
                {translationEnabled ? this.getButton(isTranslation) : null}
                {linkPreviewItems && <div>{JSON.stringify(linkPreviewItems)}</div>}
            </div>
        );
    }
}

export default ActivityMessage;
