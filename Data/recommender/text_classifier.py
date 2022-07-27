# Shlomi Ben-Shushan


import numpy as np
import spacy
import torch
from torch import nn
from torch.nn import functional as F
from torch.optim import Adam
from torch.utils.data import TensorDataset, DataLoader
from matplotlib import pyplot as plt


nlp = spacy.load('en_core_web_sm')

MODEL_UID = './models/model_uid_'

CLASSES = {
    0: 'Will-not-be-interested',
    1: 'Will-be-interested',
    2: 'Will-participate'
}


def create_convolution_layer(in_ch, out_ch, k, stride, pad, pool_k):
    return nn.Sequential(
        nn.Conv2d(in_ch, out_ch, k, stride, pad),
        nn.BatchNorm2d(out_ch),
        nn.ReLU(),
        nn.MaxPool2d(kernel_size=pool_k),
    )


def create_linear_layer(in_features, out_features):
    return nn.Sequential(
        nn.Linear(in_features, out_features),
        nn.BatchNorm1d(out_features),
        nn.ReLU(),
        nn.Dropout(),
    )


def preprocess_train_set(train_json):
    
    vectors, labels = [], []
    for example in train_json:
        vectors.append(nlp(example['description']).vector)
        labels.append(int(example['label']))
    
    n_train = len(vectors)
    indexes = [int(i) for i in list(range(n_train))]
    np.random.shuffle(indexes)
    s = int(0.2 * n_train)
    train_idx = indexes[s:]
    valid_idx = indexes[:s]

    train_x = np.array([vectors[i] for i in train_idx])
    train_y = np.array([labels[i] for i in train_idx])
    valid_x = np.array([vectors[i] for i in valid_idx])
    valid_y = np.array([labels[i] for i in valid_idx])

    train_x_t = torch.from_numpy(train_x).float()
    train_y_t = torch.from_numpy(train_y).long()
    valid_x_t = torch.from_numpy(valid_x).float()
    valid_y_t = torch.from_numpy(valid_y).long()

    train_dataset = TensorDataset(train_x_t, train_y_t)
    valid_dataset = TensorDataset(valid_x_t, valid_y_t)

    return DataLoader(train_dataset, 64), DataLoader(valid_dataset, 64)


def preprocess_test_set(test_json):
    activity_ids, activity_names, vectors = [], [], []
    for activity in test_json:
        activity_ids.append(activity['activity_id'])
        activity_names.append(activity['activity_name'])
        vectors.append(nlp(activity['description']).vector)
    test_dataset = torch.from_numpy(np.array(vectors)).float()
    return activity_ids, activity_names, test_dataset


def plot(t_losses, v_losses, t_accuracies, v_accuracies):
    plt.figure()
    plt.title('TCNN - Average loss per epoch')
    plt.xlabel('Epoch')
    plt.ylabel('Loss values')
    plt.plot(list(range(len(t_losses))), t_losses, v_losses)
    plt.legend(["Training Loss", "Validation Loss"])
    plt.savefig("TCNN_Loss_per_Epoch.png")
    plt.figure()
    plt.title('TCNN - Average accuracy per epoch')
    plt.xlabel('Epoch')
    plt.ylabel('Accuracy percentages')
    plt.plot(list(range(len(t_accuracies))), t_accuracies, v_accuracies)
    plt.legend(["Training Accuracy", "Validation Accuracy"])
    plt.savefig("TCNN_Accuracy_per_Epoch.png")


class TextClassifierNN(nn.Module):

    def __init__(self):
        super(TextClassifierNN, self).__init__()
        self.linear1 = create_linear_layer(96, 32)
        self.linear2 = create_linear_layer(32, 11)
        self.linear3 = create_linear_layer(11, len(CLASSES))
        self.optim = Adam(self.parameters(), lr=0.01)

    def forward(self, x):
        out = self.linear1(x)
        out = self.linear2(out)
        out = self.linear3(out)
        out = F.log_softmax(out, -1)
        return out

    def learn(self, train_dataset):
        self.train()
        train_loss = 0
        correct = 0
        for x, y in train_dataset:
            self.optim.zero_grad()
            y_hat = self(x)
            loss = F.nll_loss(y_hat, y)
            loss.backward()
            self.optim.step()
            train_loss += loss.item()
            pred = y_hat.data.max(1, keepdim=True)[1]
            correct += pred.eq(y.view_as(pred)).cpu().sum().item()
        train_loss /= (len(train_dataset))
        train_accuracy = (100. * correct) / len(train_dataset.dataset)
        return train_loss, train_accuracy

    def validate(self, valid_dataset):
        self.eval()
        valid_loss = 0
        correct = 0
        with torch.no_grad():
            for x, y in valid_dataset:
                y_hat = self(x)
                valid_loss += F.nll_loss(y_hat, y, reduction="sum").item()
                pred = y_hat.max(1, keepdim=True)[1]
                correct += pred.eq(y.view_as(pred)).cpu().sum().item()
        valid_loss /= len(valid_dataset.dataset)
        valid_accuracy = (100. * correct) / len(valid_dataset.dataset)
        return valid_loss, valid_accuracy


def train_model(uid, train_json, n_epochs, save_plot=False):
    model = TextClassifierNN()
    train_dataset, valid_dataset = preprocess_train_set(train_json)
    train_losses, train_accuracies = [], []
    valid_losses, valid_accuracies = [], []
    for e in range(n_epochs):

        # Train:
        t_loss, t_accuracy = model.learn(train_dataset)
        train_losses.append(t_loss)
        train_accuracies.append(t_accuracy)

        # Validate:
        v_loss, v_accuracy = model.validate(valid_dataset)
        valid_losses.append(v_loss)
        valid_accuracies.append(v_accuracy)

    torch.save(model.state_dict(), MODEL_UID + str(uid))
    if save_plot:
        plot(train_losses, valid_losses, train_accuracies, valid_accuracies)
    return f'User {uid} model was successfully updated.'


def predict(uid, test_json):
    activity_ids, activity_names, test_dataset = preprocess_test_set(test_json)
    model = TextClassifierNN()
    model.load_state_dict(torch.load(MODEL_UID + str(uid)))
    model.eval()
    predictions = []
    for aid, name, x in zip(activity_ids, activity_names, test_dataset):
        y_hat = model(x.unsqueeze(0)).max(1, keepdim=True)[1].item()
        predictions.append({
            'aid': aid,
            'title': name,
            'pred': CLASSES[y_hat]
        })
    return predictions


# train_model(1234, './datasets/train.json', 100)
# print(predict(1234, './datasets/test.json'))
